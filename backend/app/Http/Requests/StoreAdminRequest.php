<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
             
            'fname' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'lname' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'email' => 'required|string|email|max:255|unique:admins|regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
            'address' => 'sometimes|string|max:255|min:10',
            'phone' => 'sometimes|string|max:20|regex:/^01[012]\d{8}$/', 
        ];
    }
}
