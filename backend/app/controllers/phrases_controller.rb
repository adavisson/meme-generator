class PhrasesController < ApplicationController
  def index
    phrases = Phrase.all
    render json: phrases, only: [:id, :content]
  end

  def create
    phrase = Phrase.find_or_create_by(content: params[:content])
    render json: phrase, only: [:id, :content]
  end
end
