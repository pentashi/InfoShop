<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SaleCreated extends Notification
{
    use Queueable;

    public $sale;
    /**
     * Create a new notification instance.
     */
    public function __construct($sale)
    {
        $this->sale = $sale;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Sale Created - #' . $this->sale['invoice_number'])
            ->greeting('A new sale has been created.')
            ->line('#' . $this->sale['invoice_number'].' By '.$this->sale['created_by'])
            ->line('Amount: ' . $this->sale['total_amount'])
            ->line('Created at: ' . \Carbon\Carbon::parse($this->sale['created_at'])->format('Y-m-d h:i A'))
            ->action('View Sale', url('/reciept/' . $this->sale['id']));
    }

    public function toDatabase($notifiable)
    {
        return [
            'sale_id' => $this->sale['id'],
            'amount' => $this->sale['total_amount'],
            'message' => 'A new sale has been created.',
            'url' => url('/sales/' . $this->sale['id']),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
