<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
            'name' => 'sometime|max:50',
            'description' => 'sometimes',
        ];
    }
    public function messages()
    {
        return [
            'name.sometime' => 'The name field is required.',
            'name.max' => 'The name field may not be greater than 50 characters.',
            'description.sometimes' => 'The description field is required.',
        ];
    }
}
