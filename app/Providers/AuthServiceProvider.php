<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        
        Gate::define('isAdmin',function($user){
            return $user->type === 'admin';
        });

        Gate::define('isUser',function($user){
            return $user->type === 'user';
        });

        Gate::define('isAuthor',function($user){
            return $user->type === 'author';
        });

        Gate::define('isAdminOrAuthor',function($user){
            return (this.user.type === 'admin' || this.user.type === 'author');
        });

        Gate::define('isAuthorOrUser',function($user){
            return (this.user.type === 'admin' || this.user.type === 'user');
        });
        

        // $gate->define('isprofileUser',function($user, $profileUser){
        //     return $user->id === '$profileUser->id';
        // });

        
        Passport::routes();
        
        //
    }
}
