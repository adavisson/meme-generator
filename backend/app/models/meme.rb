class Meme < ApplicationRecord
  belongs_to :phrase
  belongs_to :picture
end
