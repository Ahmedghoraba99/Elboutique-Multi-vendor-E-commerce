<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;


class ReportProductResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->customer,
            'reason' => $this->reason,
            'product' => [
                'id' => $this->product->id,
                'vendor' => $this->product->vendor_id,
                'vendor_status' => $this->product->vendor->banned,
                'name' => $this->product->name,
                'description' => $this->product->description,
                'price' => $this->product->price,
                'image_url' => $this->product->images->isNotEmpty()
                    ? url('storage/' . $this->product->images->first()->image)
                    : null,
            ],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
