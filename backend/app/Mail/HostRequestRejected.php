<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HostRequestRejected extends Mailable
{
    use Queueable, SerializesModels;

    public HostRequest $hostRequest;
    public string $reason;

    /**
     * Create a new message instance.
     */
    public function __construct(HostRequest $hostRequest, string $reason)
    {
        $this->hostRequest = $hostRequest;
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Deine Host-Anfrage wurde abgelehnt',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.host_request_rejected',
            with: [
                'hostRequest' => $this->hostRequest,
                'reason' => $this->reason,
            ],
        );
    }
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
