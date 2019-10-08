<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function __construct()
    {
        //authentication to not access the api from postman :disable if u want to use api
        $this->middleware('auth:api');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       // return $request->all();

       $this->validate($request,[
         'name' => 'required|string|max:191',
         'email' => 'required|string|email|max:255|unique:users', 
         'password' => 'required|string|min:6'
       ]);

       return User::create([
           
        'name' => $request['name'], 
        'email'=> $request['email'], 
        'bio'=> $request['bio'],
        'photo'=> $request['photo'],
        'type'=> $request['type'],
        'password'=> Hash::make($request['password'])
       ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    
    public function profile()
    {
        return auth('api')->user();
        //return Auth::user();
    }

    public function updateProfile(Request $request)
    {
         //check authenticated user
        $user = auth('api')->user();

        //validate 
      
        $this->validate($request,[
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|min:6'
          ]);


        //update the current photo 
        $currentPhoto = $user->photo;

        if($request->photo != $currentPhoto)  //if u have request image 
        {
            $name = time().'.' . explode('/', explode(':', substr($request->photo,0, strpos($request->photo, ';')))[1])[1];
            \Image::make($request->photo)->save(public_path('img/profile/').$name);
            
            //modify file name
            $request->merge(['photo' =>$name]);


            ///comment: if uploaded ,then delete the old photo condition
            $userPhoto = public_path('img/profile/').$currentPhoto;
            if (file_exists($userPhoto)) { //if flie exist
                //delete the old userphoto
                @unlink($userPhoto);
            }
            
            
        }
        ///if user has change password hash/encrypt it
         if (!empty($request->password)) {
             $request->merge(['password'=> Hash::make($request['password'])]);
         }



        $user->update($request->all());

        return ['message' => "Success"];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User:: findOrFail($id);

        $this->validate($request,[
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|min:6'
          ]);

        $user->update($request->all());
        return ['message'=> 'Updated the user info'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user =User::findOrFail($id);

        //delete the user
       $user->delete();
        return ['message' => 'User deleted'];
    }
}
