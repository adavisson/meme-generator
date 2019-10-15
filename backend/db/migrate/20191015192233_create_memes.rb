class CreateMemes < ActiveRecord::Migration[5.0]
  def change
    create_table :memes do |t|
      t.string :title
      t.integer :phrase_position
      t.references :phrase, foreign_key: true
      t.references :picture, foreign_key: true

      t.timestamps
    end
  end
end
