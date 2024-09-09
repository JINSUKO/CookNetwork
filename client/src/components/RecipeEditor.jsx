/** RecipeEditor.jsx
 * 레시피 등록 페이지
 * Tiptap 라이브러리 사용
 */

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import 'prosemirror-view/style/prosemirror.css'
import styles from '../assets/styles/RecipeEditor.module.css' 

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className={styles.menuBar}>  {/* 클래스 이름에 styles 객체 사용 */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${styles.menuButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
      >
        굵게
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${styles.menuButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
      >
        기울임
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.menuButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
      >
        목록
      </button>
    </div>
  )
}

const RecipeEditor = () => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [content, setContent] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'paragraph') {
            return '1단계:\n2단계:\n3단계:'
          }
          return ''
        },
        emptyEditorClass: 'is-editor-empty',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run()
      }
      reader.readAsDataURL(file)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const recipeData = {
      title,
      subtitle,
      mainImage,
      cookingTime,
      servings,
      difficulty,
      content
    }
    console.log('Recipe submitted:', recipeData)
    // 여기에 서버로 데이터를 전송하는 로직을 구현합니다.
  }

  return (
    <div className={styles.recipeEditor}>
      <h1 className={styles.recipeTitle}>레시피 등록</h1>
      <form onSubmit={handleSubmit} className={styles.recipeForm}>
        <input
          type="text"
          placeholder="레시피 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.recipeInput}
        />
        <input
          type="text"
          placeholder="부제목"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className={styles.recipeInput}
        />
        <input
          type="text"
          placeholder="대표 이미지"
          value={mainImage}
          onChange={(e) => setMainImage(e.target.value)}
          className={styles.recipeInput}
        />
        <input
          type="text"
          placeholder="조리 시간"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          className={styles.recipeInput}
        />
        <input
          type="text"
          placeholder="1인분"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          className={styles.recipeInput}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={styles.recipeSelect}
        >
          <option value="">난이도</option>
          <option value="쉬움">쉬움</option>
          <option value="보통">보통</option>
          <option value="어려움">어려움</option>
        </select>
        <MenuBar editor={editor} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.recipeSelect}
        />
        <EditorContent editor={editor} className={styles.editorContent} />
        <button type="submit" className={styles.submitButton}>레시피 등록</button>
      </form>
    </div>
  )
}

export default RecipeEditor;