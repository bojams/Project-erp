<?php

namespace App\Exceptions;

class InsufficientStockException extends BusinessException
{
    public function __construct(string $message = 'Insufficient stock')
    {
        parent::__construct($message, 409);
    }
}
