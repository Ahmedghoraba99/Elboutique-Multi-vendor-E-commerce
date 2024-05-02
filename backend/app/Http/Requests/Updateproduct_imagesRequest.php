<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Updateproduct_imagesRequest extends FormRequest
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
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_id' => 'required|exists:products,id',
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.required' => 'Please upload at least one image.',
            'images.*.image' => 'The file must be an image.',
            'images.*.mimes' => 'The image must be a jpeg, png, jpg, or gif.',
            'images.*.max' => 'The image size should not exceed 2MB.',
            'product_id.required' => 'Product ID is required.',
            'product_id.exists' => 'Invalid product ID.',
        ];
    }
}
