<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminRequest extends FormRequest
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
        $method=$this->method();
        if($method=='PUT')
            {
                return 
                [
                    'fname' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'lname' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'email' => 'required|string|email|max:255|unique:admins|regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
                    'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
                    'address' => 'required|string|max:255|min:10',
                    'phone' => 'required|string|max:20|regex:/^01[012]\d{8}$/', 
                    'image' => 'nullable|image|mimes:jpg,png|max:2048',
                ];
            }
            else
            {
                return 
                [
                    'fname' => 'sometimes|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'lname' => 'sometimes|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'email' => 'sometimes|string|email|max:255|unique:admins|regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
                    'password' => 'sometimes|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
                    'address' => 'sometimes|string|max:255|min:10',
                    'phone' => 'sometimes|string|max:20|regex:/^01[012]\d{8}$/', 
                    'image' => 'nullable|image|mimes:jpg,png|max:2048',
                ];
            }
    }
}
