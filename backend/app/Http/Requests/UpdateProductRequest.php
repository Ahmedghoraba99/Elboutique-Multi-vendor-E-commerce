<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            "name" => "sometimes|string|max:255",
            'description' => "sometimes|string|max:1000",
            'price' => "sometimes|numeric|min:0",
            'stock' => "sometimes|numeric|min:0",
            'images' => "sometimes|array",
            "category_id" => "sometimes|string|exists:categories,id",
            "tags" => "sometimes|array",
            "tags.*" => "exists:tags,id",
            "images.*" => "sometimes|image|mimes:jpeg,png,jpg|max:2048", // Added max file size validation
            "vendor_id" => "sometimes|string|exists:vendors,id",
            "sale" => "sometimes|numeric|min:0",
            "is_featured" => "sometimes|boolean"
        ];
    }
}
