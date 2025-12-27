// src/pages/SupportTickets.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { gameAPI } from '../services/api'
import '../styles/pages/support-tickets.css'

function SupportTickets() {
    const { user } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    // Load user tickets
    const loadTickets = async () => {
        try {
            const response = await gameAPI.getUserSupportTickets()
            // Sort by created_at desc, then by status priority
            const sorted = response.sort((a, b) => {
                // First by date desc
                const dateA = new Date(a.created_at)
                const dateB = new Date(b.created_at)
                if (dateA > dateB) return -1
                if (dateA < dateB) return 1

                // Then by status priority
                const statusOrder = {
                    'offen': 1,
                    'in Bearbeitung': 2,
                    'gelesen': 3,
                    'Fehlmeldung': 4,
                    'geschlossen': 5
                }
                return statusOrder[a.status] - statusOrder[b.status]
            })
            setTickets(sorted)
        } catch (error) {
            console.error('Failed to load tickets:', error)
            showToast('Fehler beim Laden der Tickets', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTickets()
    }, [])

    // Handle ticket click - navigate to edit page
    const handleTicketClick = (ticketId) => {
        navigate(`/support-tickets/${ticketId}/edit`)
    }

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'offen': return 'status-offen'
            case 'in Bearbeitung': return 'status-bearbeitung'
            case 'gelesen': return 'status-gelesen'
            case 'Fehlmeldung': return 'status-fehl'
            case 'geschlossen': return 'status-geschlossen'
            default: return ''
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="support-tickets">
                <h1>Meine Support-Tickets</h1>
                <div className="loading">Tickets werden geladen...</div>
            </div>
        )
    }

    return (
        <div className="support-tickets">
            <h1>Meine Support-Tickets</h1>
            
            {tickets.length === 0 ? (
                <div className="no-tickets">
                    <p>Sie haben noch keine Support-Tickets erstellt.</p>
                </div>
            ) : (
                <div className="tickets-list">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card" onClick={() => handleTicketClick(ticket.id)}>
                            <div className="ticket-header">
                                <div className="ticket-title">{ticket.title}</div>
                                <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </div>
                            </div>
                            <div className="ticket-meta">
                                <span className="ticket-date">Erstellt: {formatDate(ticket.created_at)}</span>
                                <span className="ticket-urgency">Dringlichkeit: {ticket.urgency}</span>
                            </div>
                            <div className="ticket-message">
                                {ticket.message.length > 100 
                                    ? `${ticket.message.substring(0, 100)}...` 
                                    : ticket.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SupportTickets