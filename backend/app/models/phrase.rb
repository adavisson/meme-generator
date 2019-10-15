class Phrase < ApplicationRecord
  has_many :memes
  has_many :pictures, through: :memes
end
