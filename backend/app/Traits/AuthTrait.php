<?php
namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

trait AuthTrait {

    public function uploadImage($image='image',$request=null,$folder="",$model=null){
        

        
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

    public function updateUserStatus($model=null,$attribute = 'banned'){

        $newStatus = $model->$attribute === "true" ? "false" : "true";
        $model->update([$attribute => $newStatus]);
    
         
        $action = $attribute === 'banned' ? 'banned' : 'activated';
        $message = $newStatus === "true" ? "User has been successfully $action." : "User has been successfully un$action.";
    
      
        return $this->sendSuccessResponse($message, $model);

        

    }

    
 
    
    private function sendSuccessResponse($message='Success',$model=null)
    {
        return response()->json(['message' => "$message", 'data' => $model], 201);
    }

   

   


}