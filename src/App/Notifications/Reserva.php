<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Reserva extends Notification implements ShouldQueue
{
    use Queueable;

    public string $title;
    public string $author;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $author)
    {
        $this->title = $title;
        $this->author = $author;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $titulo = $this->title; 
        $autor = $this->author;   
        $nombreUsuario = $notifiable->name;  
        
        return (new MailMessage)
        ->greeting('Hola ' . $nombreUsuario)  
        ->line('¡Buenas noticias! El libro "' . $titulo . '" de ' . $autor . ' ya está disponible para su recogida.')
        ->line('Puedes venir a recogerlo en cuanto quieras. No olvides traer tu identificación y este email como comprobante de reserva.')
        ->action('Visitar nuestra página', url('/'))  
        ->line('¡Gracias por elegirnos! Si tienes alguna pregunta, no dudes en contactarnos.');


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
