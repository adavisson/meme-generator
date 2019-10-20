class MemesController < ApplicationController
  def index
    memes = Meme.all
    render json: memes, only: [:id, :title, :phrase_position, :phrase_id, :picture_id]
  end

  def create
    meme = Meme.create(title: params[:title], phrase_position: params[:phrase_position], phrase_id: params[:phrase_id], picture_id: params[:picture_id]);
    render json: meme
  end
end
