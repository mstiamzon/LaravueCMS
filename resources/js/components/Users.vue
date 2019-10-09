<template>
    <div class="container">
       <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">User Table</h3>

                <div class="card-tools">
                  <!-- <div class="input-group input-group-sm" style="width: 150px;">
                    <input type="text" name="table_search" class="form-control float-right" placeholder="Search">

                    <div class="input-group-append">
                      <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                    </div>
                  </div> -->
                <button class="btn btn-success" @click="newModal">
                    Add New <i class="fas fa-user-plus fa-fw"></i></button>

                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                       <th>Registered At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                     <td>{{user.id }}</td>
                      <td>{{user.name }}</td>
                      <td>{{user.email }}</td>
                      <td>{{user.type | upText }}</td>
                      <td>{{user.created_at | myDate}}</td>
                      <td>
                         <a href="#" @click="editModal(user)"><i class="fas fa-edit blue"></i></a>
                         <a href="#" @click="deleteUser(user.id)"><i class="fas fa-trash red"></i> </a>
                      </td>
                    </tr>
                 
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>


    <!-- added for not admin /404 not found  -->
      <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>
 
 
 <!-- Modal -->
<div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" v-show="!editmode" id="addNewLabel">Add New</h5>
        <h5 class="modal-title" v-show="editmode" id="addNewLabel">Update User's Info</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

  <form @submit.prevent="editmode ? updateUser() : createUser()">
      <div class="modal-body">
     
    <div class="form-group">
      <input v-model="form.name" type="text" name="name" placeholder="Name"
        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
      <has-error :form="form" field="name"></has-error>
    </div>
   <div class="form-group">
      <input v-model="form.email" type="email" name="email" placeholder="Email Address"
        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
      <has-error :form="form" field="email"></has-error>
    </div>
     <div class="form-group">
      <textarea v-model="form.bio"  name="bio" id="bio" placeholder="Short bio for user(optional)"
        class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
      <has-error :form="form" field="bio"></has-error>
    </div>

     <div class="form-group">
      <select name="type" v-model="form.type" id="type" 
        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
            <option value="">Select User Role</option>
             <option value="admin">Admin</option>
             <option value="user">Standard User</option>
             <option value="author">Author</option>
      </select>
      <has-error :form="form" field="type"></has-error>
    </div>

    <div class="form-group">
      <input v-model="form.password" type="password" name="password" id="password"
        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
      <has-error :form="form" field="password"></has-error>
    </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        <button v-show="editmode" type="submit"  class="btn btn-success">Update</button>
         <button  v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
      </div>
      </form>
    </div>
  </div>
</div>
    
    
</div>
</template>

<script>
    export default {
        data(){
            return{
              editmode:false,
                users:{},
                form:new Form({
                       id:'',
                       name: '',
                       password: '',
                       email: '',
                       type:'',
                       bio:'',
                       photo:''
                })
            }

        },
        methods:{
          updateUser(){
            console.log('Editing Data')
            this.$Progress.start();
              this.form.put('api/user/' + this.form.id)
              .then(()=>{
                //success
                 $('#addNew').modal('hide');
                Swal.fire(
                 'Updated!',
                 'Information has been Updated.',
                 'success'
                 )
                this.$Progress.finish();
                Fire.$emit('AfterCreate');
              })
              .catch(()=>{
                Swal.fire("Failed!", "There was something wronge.", "warning");
                 this.$Progress.fail();  //start progress bar

              });
          },
          editModal(user){
             this.editmode =true;
             this.form.reset();
              $('#addNew').modal('show');
              this.form.fill(user); //getting details 
          },
          newModal(){
             this.editmode =false;
            this.form.reset();
              $('#addNew').modal('show');
          },
          deleteUser(id){           
          Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
            }).then((result) => {

              //Send request to the server
              if (result.value) {
              this.form.delete('api/user/' + id).then(()=>{ 
                Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
               )
             //Fire Custom event
             Fire.$emit('AfterCreate')  
              }).catch(()=>{
                  Swal.fire("Failed!", "There was something wronge.", "warning");
              })
         }
            
        })
          },
            loadUser(){
            //  if (this.$gate.isAdmin()) {
            //    axios.get("api/user").then(({data})=>(this.users = data.data));
            //  } 
             if (this.$gate.isAdminOrAuthor()) {
               axios.get("api/user").then(({data})=>(this.users = data.data));
             } 
            },
            createUser(){
                 this.$Progress.start()  //start progress bar

                //submit the form via a POST request
                this.form.post('api/user')
                  .then(()=>{
                    //Fire Custom event
                   Fire.$emit('AfterCreate')  
                  //hide modal
                  $('#addNew').modal('hide');

                  ///sweet alert
                  toast.fire({   
                   type: 'success',
                  title: 'User Created successfully'
               });

                this.$Progress.finish()  //finish
                  })
                  .catch(()=>{


                  })

                  
  
            }
        },
        created(){
            this.loadUser();
           //Fire Custom event
            Fire.$on('AfterCreate',()=> {
              this.loadUser();
            })


        }
    
    }
</script>
