/** RecipeUpdate.jsx
 * 레시피 수정 페이지
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import 'prosemirror-view/style/prosemirror.css'
import styles from '../assets/styles/RecipeEditor.module.css' 
import fetchInterceptorAuthToken from '../fetchInterceptorAuthToken';

const RecipeEditor = ({ user }) => {
  if (!user) {
    console.log(user)
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const navigate = useNavigate();
  const { recipe_id } = useParams(); // /api/updateRecipe/:recipe_id로 레시피 데이터롤 호출
  const API_URL = import.meta.env.VITE_HOST_IP;

  const [recipeName, setRecipeName] = useState('')
  const [category, setCategory] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [recipeDesc, setRecipeDesc] = useState('')
  const [recipeImg, setRecipeImg] = useState('')
  const [cookedTime, setCookedTime] = useState('')
  const [serving, setServing] = useState('')
  const [level, setLevel] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', count: '', unit: '' }])
  const [steps, setSteps] = useState([{ order: 1, desc: '', img: '' }])
  const [tips, setTips] = useState('')
  const [postType, setPostType] = useState('')

  // const [recipeData, setRecipeData] = useState({
  //   user_id: user.user_id, 
  //   recipe_name: recipeName,
  //   category,
  //   filters: selectedFilters,
  //   recipe_img: recipeImg,
  //   recipe_desc: recipeDesc,
  //   cooked_time: cookedTime,
  //   serving,
  //   level,
  //   ingredients: ingredients.map(ing => `${ing.name} ${ing.count} ${ing.unit}`),
  //   cooked_order: steps.map(step => ({
  //     cooked_order: step.order,
  //     order_desc: step.desc,
  //     order_img: step.img
  //   })),
  //   tips
  // });
  
  const categories = [
    { name: '전체'},
    { name: '한식'},
    { name: '양식'},
    { name: '중식'},
    { name: '일식'}
  ];
  
  const filterOptions = [
    "메인요리", "반찬", "국/탕", "디저트", "면",
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주",
    "스프", "간식", "음료", "다이어트", "도시락"
  ];

  // 수정할 레시피 데이터 호출
  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`${API_URL}/api/updateRecipe/${recipe_id}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('레시피 데이터를 불러오는데 실패했습니다.');
        }
        const recipeData = await response.json();
        setRecipeName(recipeData.recipe_name);  // 기존 레시피 데이터를 화면에 표시
        setCategory(recipeData.category);
        setSelectedFilters(recipeData.filters);
        setRecipeDesc(recipeData.recipe_desc);
        setRecipeImg(recipeData.recipe_img);
        setCookedTime(recipeData.cooked_time);
        setServing(recipeData.serving);
        setLevel(recipeData.level);
        setIngredients(recipeData.ingredients.map(ing => {
          const [name, count, unit] = ing.split(' ');
          return { name, count, unit };
        }));
        setSteps(recipeData.cooked_order);
        setTips(recipeData.tips);
      } catch (error) {
        console.error('레시피 데이터 로드 오류', error);
      }
    };

    getRecipe();
  }, [recipe_id]);  // 


  // 조리순서 작성 에디터 부분
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder:  '레시피 내용을 입력하세요.'
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setSteps(prevSteps => prevSteps.map(step => ({...step, desc: content})));
    },
  })

  // 필터 선택
  const handleFilterChange = (filter) => {
    setSelectedFilters(prevFilters => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter(f => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  }

  //대표이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setRecipeImg(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 재료 입력
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  // 재료 추가
  const addIngredient = () => {
    setIngredients([...ingredients, {name: '', count:'', unit:''}])
  }
  
  // 단계 입력
  const handleStepChange = (index, value) => {
    setSteps(prevSteps => 
      prevSteps.map((step, i) => 
        i === index ? { ...step, desc: value } : step
      )
    );
  }

  // 단계 추가
  const addStep = () => {
    setSteps([...steps, { order: steps.length +1, desc:'', img:''}])
  }


  // 단계별 이미지 업로드
  const handleStepImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSteps(prevSteps => 
          prevSteps.map((step, i) => 
            i === index ? { ...step, img: e.target.result } : step
          )
        );
      }
      reader.readAsDataURL(file)
    }
  }

  
  // 레시피 수정(제출)
  const handleUpdate = async (e) => {
    e.preventDefault()
    const recipeData = {
      user_id: user.user_id, 
      recipe_name: recipeName,
      category,
      filters: selectedFilters,
      recipe_img: recipeImg,
      recipe_desc: recipeDesc,
      cooked_time: cookedTime,
      serving,
      level,
      ingredients: ingredients.map(ing => `${ing.name} ${ing.count} ${ing.unit}`),
      cooked_order: steps.map(step => ({
        cooked_order: step.order,
        order_desc: step.desc,
        order_img: step.img
      })),
      tips,
      post_type: postType
    };
    console.log('제출할 데이터:', recipeData);

    try {
      const response = await fetch(`${API_URL}/api/updateRecipe/${recipe_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    })
    if (!response.ok) {
      throw new Error('레시피 수정에 실패했습니다.');
    }
    alert("레시피가 수정되었습니다.");
    navigate("/myrecipe")
    } catch (error) {
      console.error('레시피 수정 오류', error);
    }
  };

  // 레시피 삭제 기능: post_type을 9번으로 수정
  const handleDelete = async () => {
    if (window.confirm('레시피를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${API_URL}/api/updateRecipe/${recipe_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_type: "9" // 레시피 데이터를 "삭제됨" 상태로 변경
        })
      });

      if (!response.ok) {
        throw new Error('레시피 삭제에 실패했습니다.');
      }
      console.log(response);
      alert("레시피가 성공적으로 삭제되었습니다.")
      navigate("/myrecipe");
    } catch (error) {
      console.error('레시피 등록 오류', error);
    }
  };

  return (
    <div className={styles.recipeEditor}>
      <h1 className={styles.recipeTitle}>레시피 수정</h1>
      <form onSubmit={handleSubmit} className={styles.recipeForm}>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="레시피 제목"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
            className={`${styles.recipeInput} ${styles.halfWidth}`}
          />
        </div>
        <div className={styles.formGroup}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${styles.recipeInput} ${styles.quarterWidth}`}
            required
          >
            <option value="">카테고리</option>
            <option value="한식">한식</option>
            <option value="양식">양식</option>
            <option value="중식">중식</option>
            <option value="일식">일식</option>
          </select></div>
          <div className={styles.filterOptions}>
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`${styles.filterToggle} ${selectedFilters.includes(filter) ? styles.active : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>  
        <div className={styles.formGroup}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setRecipeImg)}
            className={`${styles.recipeSelect} ${styles.halfWidth}`}
            // required
          />
          {recipeImg && <img src={recipeImg} alt="Recipe" className={styles.previewImage} />}
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="간단한 설명을 적어주세요."
            value={recipeDesc}
            onChange={(e) => setRecipeDesc(e.target.value)}
            className={`${styles.recipeInput} ${styles.fullWidth}`}
          />
        </div>

        <p className={styles.boldSmallText}>정보</p>
        <div className={styles.inputWithLabel}>
          <input
            type="number"
            placeholder="조리 시간"
            value={cookedTime}
            onChange={(e) => setCookedTime(e.target.value)}
            className={`${styles.recipeInput} ${styles.quarterWidth}`}
            required
            min="10"
            step="10"
          />
          <span className={styles.inputLabel}>분</span>
          <div className={styles.inputWithLabel}>
            <input
              type="number"
              value={serving}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseInt(value) > 0) {
                  setServing(value)
                  }
                }}
              min="1"
              className={`${styles.recipeInput} ${styles.quarterWidth}`}
            />
            <span className={styles.inputLabel}>인분</span>
          </div>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={`${styles.recipeInput} ${styles.quarterWidth}`}
          >
            <option value="">난이도</option>
            <option value="1">쉬움</option>
            <option value="2">보통</option>
            <option value="3">어려움</option>
          </select>
        </div>
        <hr />

        <p className={styles.boldSmallText}>재료</p>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.formGroup}>
            <input
              type="text"
              placeholder="재료명"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className={`${styles.recipeInput} ${styles.thirdWidth}`}
            />
            <input
              type="text"
              placeholder="수량"
              value={ingredient.count}
              onChange={(e) => handleIngredientChange(index, 'count', e.target.value)}
              className={`${styles.recipeInput} ${styles.quarterWidth}`}
            />
            <input
              type="text"
              placeholder="단위(예:g, 개)"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              className={`${styles.recipeInput} ${styles.quarterWidth}`}
            />
          </div>
        ))}
        <button type="button" onClick={addIngredient} className={styles.addButton}>재료 추가</button>

        <hr />
        <p className={styles.boldSmallText}>조리 순서</p>
        {steps.map((step, index) => (
          <div key={index} className={styles.formGroup}>
            <div className={styles.stepOrder}>{step.order}</div>
            {/* <EditorContent editor={editor} className={styles.editorContent} /> */}
            <textarea
              placeholder="조리 방법을 적어주세요."
              value={step.desc}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className={`${styles.recipeTextarea} ${styles.fullWidth}`}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleStepImageUpload(index, e.target.files[0])}
              className={`${styles.recipeInput} ${styles.fullWidth}`}
            />
            {step.img && <img src={step.img} alt={`Step ${step.order}`} className={styles.stepImage} />}
          </div>

        ))}
        <button type="button" onClick={addStep} className={styles.addButton}>단계 추가</button>

        <hr />
        <p className={styles.boldSmallText}>요리팁</p>
        <div>
          <textarea
                placeholder="예) 고기요리에는 소금보다 설탕을 먼저 넣어야 단맛이 겉돌지 않고 육질이 부드러워요."
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className={`${styles.recipeTextarea} ${styles.fullWidth}`}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/myrecipe" className={styles.cancelButton}>취소</Link>
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>삭제</button>
          <button type="submit" onClick={handleUpdate} className={styles.submitButton}>수정 완료</button>
        </div>
      </form>
    </div>
  )
}}

export default RecipeEditor;