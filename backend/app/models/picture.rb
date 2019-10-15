class Picture < ApplicationRecord
  has_many :memes
  has_many :phrases, through: :memes
end
