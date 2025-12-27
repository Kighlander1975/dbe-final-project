// src/pages/SupportTicketEdit.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { gameAPI } from '../services/api'
import '../styles/pages/support-ticket-edit.css'

function SupportTicketEdit() {
    const { user, isAdmin } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const { id } = useParams()

    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        status: '',
        title: '',
        urgency: '',
        message: ''
    })

    // Load ticket data
    const loadTicket = async () => {
        try {
            const response = await gameAPI.getSupportTicket(id)
            setTicket(response)
            setFormData({
                status: response.status,
                title: response.title,
                urgency: response.urgency,
                message: response.message
            })
        } catch (error) {
            console.error('Failed to load ticket:', error)
            showToast('Fehler beim Laden des Tickets', 'error')
            navigate('/support-tickets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTicket()
    }, [id])

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle save
    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Check if any changes were made
            const hasChanges = 
                formData.title !== ticket.title ||
                formData.urgency !== ticket.urgency ||
                formData.message !== ticket.message ||
                formData.status !== ticket.status

            if (!hasChanges) {
                localStorage.setItem('ticketUpdateToast', JSON.stringify({
                    message: 'Keine Änderungen vorgenommen',
                    type: 'info'
                }))
                window.location.href = '/support-tickets'
                return
            }

            // Check if only status changed to "Fehlmeldung"
            const onlyStatusToFehlmeldung = 
                formData.status === 'Fehlmeldung' && 
                formData.status !== ticket.status &&
                formData.title === ticket.title &&
                formData.urgency === ticket.urgency &&
                formData.message === ticket.message

            // Prepare data to send
            let dataToSend = { ...formData }

            // If changes were made (and not only status to Fehlmeldung), set status to "offen"
            if (!onlyStatusToFehlmeldung) {
                dataToSend.status = 'offen'
            }

            await gameAPI.updateSupportTicket(id, dataToSend)
            
            // Store success message for display after page reload
            localStorage.setItem('ticketUpdateToast', JSON.stringify({
                message: 'Ticket wurde aktualisiert',
                type: 'success'
            }))
            
            window.location.href = '/support-tickets'
        } catch (error) {
            console.error('Failed to update ticket:', error)
            localStorage.setItem('ticketUpdateToast', JSON.stringify({
                message: 'Fehler beim Aktualisieren des Tickets',
                type: 'error'
            }))
            window.location.href = '/support-tickets'
        } finally {
            setSaving(false)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        navigate('/support-tickets')
    }

    // Check if user can edit this ticket
    const canEdit = ticket && ticket.status !== 'geschlossen' && (user.email === ticket.email || isAdmin())

    // Status options - always include current status, plus "offen" and "Fehlmeldung"
    const getStatusOptions = () => {
        const options = [
            { value: ticket.status, label: getStatusLabel(ticket.status) }
        ]

        // Add "offen" if not already current
        if (ticket.status !== 'offen') {
            options.push({ value: 'offen', label: 'Offen' })
        }

        // Add "Fehlmeldung" if not already current
        if (ticket.status !== 'Fehlmeldung') {
            options.push({ value: 'Fehlmeldung', label: 'Fehlmeldung' })
        }

        return options
    }

    // Helper to get status label
    const getStatusLabel = (status) => {
        const labels = {
            'offen': 'Offen',
            'in Bearbeitung': 'In Bearbeitung',
            'gelesen': 'Gelesen',
            'Fehlmeldung': 'Fehlmeldung',
            'geschlossen': 'Geschlossen'
        }
        return labels[status] || status
    }

    if (loading) {
        return (
            <div className="support-ticket-edit">
                <div className="loading">Ticket wird geladen...</div>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="support-ticket-edit">
                <div className="error">Ticket nicht gefunden</div>
            </div>
        )
    }

    if (ticket.status === 'geschlossen') {
        return (
            <div className="support-ticket-edit">
                <h1>Support-Ticket geschlossen</h1>
                <div className="closed-ticket">
                    <p>Dieses Support-Ticket wurde bereits geschlossen und kann nicht mehr bearbeitet werden.</p>
                    <button type="button" onClick={() => navigate('/support-tickets')} className="btn-cancel">
                        Zurück zur Übersicht
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="support-ticket-edit">
            <h1>Support-Ticket bearbeiten</h1>

            <div className="ticket-info">
                <div className="info-item">
                    <strong>Ticket-ID:</strong> #{ticket.id}
                </div>
                <div className="info-item">
                    <strong>Erstellt:</strong> {new Date(ticket.created_at).toLocaleString('de-DE')}
                </div>
                <div className="info-item">
                    <strong>E-Mail:</strong> {ticket.email}
                </div>
            </div>

            <form onSubmit={handleSave} className="edit-form">
                <div className="form-group">
                    <label htmlFor="title">Betreff</label>
                    <select
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={!canEdit}
                        required
                    >
                        <option value="Bug gefunden">Bug gefunden</option>
                        <option value="Login-/Registrierungsproblem">Login-/Registrierungsproblem</option>
                        <option value="sonstiges Problem">sonstiges Problem</option>
                        <option value="Nachricht an Admin">Nachricht an Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="urgency">Dringlichkeit</label>
                    <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        disabled={!canEdit}
                        required
                    >
                        <option value="1 - notice">1 - notice</option>
                        <option value="2 - info">2 - info</option>
                        <option value="3 - warning">3 - warning</option>
                        <option value="4 - danger">4 - danger</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={!canEdit}
                        required
                    >
                        {getStatusOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Nachricht</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={!canEdit}
                        rows={6}
                        required
                    />
                </div>

                {canEdit ? (
                    <div className="form-actions">
                        <button type="submit" disabled={saving} className="btn-save">
                            {saving ? 'Speichern...' : 'Speichern'}
                        </button>
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Abbrechen
                        </button>
                    </div>
                ) : (
                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Zurück
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default SupportTicketEdit