<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StoreProductRequest extends FormRequest
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
            "name" => "required|string|max:255",
            'description' => "required|string|max:1000",
            'price' => "required|numeric|min:0",
            'stock' => "required|numeric|min:0",
            'images' => "required|array",
            "category_id" => "required|string|exists:categories,id",
            "tags" => "sometimes|array",
            "attributes" => "required|array",
            "tags.*" => "exists:tags,id",
            "images.*" => "required|image|mimes:jpeg,png,jpg|max:2048", // Added max file size validation
            "vendor_id" => "required|string|exists:vendors,id",
        ];
    }

    /**
     * Custom error messages for validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            "name.required" => "Name is required",
            "name.max" => "Name must not exceed 255 characters", // Added max length error message
            "description.required" => "Description is required",
            "description.max" => "Description must not exceed 1000 characters", // Added max length error message
            "price.required" => "Price is required",
            "price.numeric" => "Price must be a number",
            "price.min" => "Price must be at least 0", // Added minimum value error message
            "stock.required" => "Stock is required",
            "stock.numeric" => "Stock must be a number",
            "stock.min" => "Stock must be at least 0", // Added minimum value error message
            "images.required" => "Images are required",
            "category.required" => "Category is required",
            "category.exists" => "Category does not exist",
            "tags.*.exists" => "One or more tags do not exist",
            "attributes.required" => "Attributes are required",
            "images.*.required" => "Image is required",
            "images.*.image" => "Image must be an image",
            "images.*.mimes" => "Image must be a jpeg, png, or jpg",
            "images.*.max" => "Image must not exceed 2MB", // Added max file size error message
            "vendor.required" => "Vendor is required",
            "vendor.exists" => "Vendor does not exist",
        ];
    }
}
