/**
 * 
 */

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        Bullet List
      </button>
    </div>
  )
}

const RecipeEditor = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // 여기에 레시피 제출 로직을 구현합니다.
    console.log('Recipe submitted:', { title, content })
  }

  return (
    <div className="write-recipe">
      <h1>레시피 등록</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipe-title">레시피 제목:</label>
          <input
            id="recipe-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>레시피 내용:</label>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <button type="submit">레시피 등록</button>
      </form>
    </div>
  )
}

export default RecipeEditor;