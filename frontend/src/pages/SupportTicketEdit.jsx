// src/pages/SupportTicketEdit.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { gameAPI } from '../services/api'
import '../styles/pages/support-ticket-edit.css'

function SupportTicketEdit() {
    const { user } = useAuth()
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
            await gameAPI.updateSupportTicket(id, formData)
            showToast('Ticket wurde aktualisiert', 'success')
            navigate('/support-tickets')
        } catch (error) {
            console.error('Failed to update ticket:', error)
            showToast('Fehler beim Aktualisieren des Tickets', 'error')
        } finally {
            setSaving(false)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        navigate('/support-tickets')
    }

    // Check if user can edit this ticket
    const canEdit = ticket && (user.email === ticket.email || user.isAdmin())

    // Status options for users (limited)
    const userStatusOptions = [
        { value: 'Fehlmeldung', label: 'Fehlmeldung' }
    ]

    // Status options for admins (all)
    const adminStatusOptions = [
        { value: 'offen', label: 'Offen' },
        { value: 'in Bearbeitung', label: 'In Bearbeitung' },
        { value: 'gelesen', label: 'Gelesen' },
        { value: 'Fehlmeldung', label: 'Fehlmeldung' },
        { value: 'geschlossen', label: 'Geschlossen' }
    ]

    const statusOptions = user.isAdmin() ? adminStatusOptions : userStatusOptions

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
                        {statusOptions.map(option => (
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