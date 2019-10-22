class ChangePhrasePositionColumnType < ActiveRecord::Migration[5.0]
  def change
    change_column :memes, :phrase_position, :string
  end
end
