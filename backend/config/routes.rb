Rails.application.routes.draw do
  resources :memes
  resources :phrases, only: [:index, :create]
  resources :pictures, only: [:index, :show]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
