class PhrasesController < ApplicationController
  def index
    phrases = Phrase.all
    render json: phrases, only: [:id, :content]
  end
end
