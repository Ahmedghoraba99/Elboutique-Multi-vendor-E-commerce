<?php
namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

trait AuthTrait {

    public function uploadImage($request,$folder,$model=null){
        
        if ($model!=null and $model->image) {
             
            Storage::delete("public/images/$folder/$model->image");
            $imageName = $model->id.".". $request->file('image')->getClientOriginalExtension();
             
              $request->file('image')->storeAs("public/images/$folder", $imageName);
        }else{
            $imageName = $request->file('image')->getClientOriginalName();
              $request->file('image')->storeAs("public/images/$folder",$imageName);
        }
        return   $imageName ;
    }
    // public function reqValidation($user='', $priority='required',$user_id='' ){
        
    //     return array_merge(
    //         $this->commenRules($priority),
    //         $this->email_phone_rules($user,'email',$priority,$user_id),
    //         $this->email_phone_rules($user,'phone',$priority,$user_id),
    //     );
        
        
    // }
    // private function commenRules($priority): array{
    //     return [
             
    //         'name' => "$priority|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/",
    //         'password' => "$priority|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/",
    //         'address' => 'sometimes|string|max:255|min:10',
    //         'image' => 'sometimes|nullable|image|mimes:jpg,png|max:2048',
    //     ];

    // }

    // private function email_phone_rules($user,$field,$priority='required',$user_id): array
    // {
       
    //     if($field=="email"){
    //         $regex = '/^[^@\s]+@[^@\s]+\.[^@\s]+$/';
    //     }
    //     else if($field=="phone"){
    //         $regex = '/^01[012]\d{8}$/';
    //     }
    //     $validationArray=[
    //         "$field" => [
    //             "$priority",
    //             'string',
    //             'max:50',
    //             "regex:$regex",
    //         ],
    //     ];
    //     if($user=='admin'&&$priority=='sometimes'){
            
    //         array_push($validationArray["$field"],Rule::unique('admins')->ignore($user_id),
    //         Rule::unique('users'));
    //     }
    //     elseif($user=='user'&&$priority=='sometimes'){
        
    //         array_push($validationArray["$field"],Rule::unique('users')->ignore($user_id),
    //         Rule::unique('admins'));
    //     }else{
            
    //         array_push($validationArray["$field"],Rule::unique('admins'),
    //         Rule::unique('users'));
    //     }
       
    //     return $validationArray;
    // }

   


}