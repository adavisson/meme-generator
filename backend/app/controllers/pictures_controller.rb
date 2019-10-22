class PicturesController < ApplicationController

  def index
    pictures = Picture.all
    render json: pictures, only: [:id, :title, :link]
  end

  def show
    picture = Picture.find_by(id: params[:id])
    if picture
      render json: picture, only: [:id, :title, :link], include: [:phrases]
    else
      render json: {error: "No picture found with matching id."}
    end
  end
end
