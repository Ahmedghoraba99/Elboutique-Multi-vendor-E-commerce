<?php
namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

trait AuthTrait {

    public function uploadImage($image='image',$request,$folder,$model=null){
        

        
        if ($model!=null and $model->image) {
             
            Storage::delete("public/images/$folder/$model->image");
            $imageName = $model->id.".". $request->file($image)->getClientOriginalExtension();
             
              $request->file($image)->storeAs("public/images/$folder", $imageName);
        }else{
            $imageName = $request->file($image)->getClientOriginalName();
              $request->file($image)->storeAs("public/images/$folder",$imageName);
        }
        return   $imageName ;
    }

   

   


}