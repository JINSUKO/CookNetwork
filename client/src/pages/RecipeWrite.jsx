/** RecipeWrite.jsx
 * 레시피 등록 페이지
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import 'prosemirror-view/style/prosemirror.css';
import styles from '../assets/styles/RecipeEditor.module.css';
import DropdownSelector from '../components/DropdownSelector';

const RecipeWrite = ({ user }) => {
  if (!user) {
    // console.log(user)
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState('')
  const [category, setCategory] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [recipeDesc, setRecipeDesc] = useState('')
  const [recipeImg, setRecipeImg] = useState('')
  const [recipeImgPreview, setRecipeImgPreview] = useState('')
  const [cookedTime, setCookedTime] = useState('')
  const [serving, setServing] = useState('')
  const [level, setLevel] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', count: '', unit: ''}])
  const [steps, setSteps] = useState([{ order: 1, desc: '', img: '', imgFile: null }])
  const [tips, setTips] = useState('')
  
  const API_URL = import.meta.env.VITE_HOST_IP;

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

  
  // 대표 이미지 업로드 함수
  const uploadImage = async (event) => {
    const file = event.target.files[0]
    
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택해주세요.');
      return;
    }

    if (file) {
      setRecipeImg(file)    // 파일 객체 저장
      const reader = new FileReader()
      reader.onload = (e) => {
        setRecipeImgPreview(e.target.result)  // 미리보기 URL 저장
      }
      reader.readAsDataURL(file)
    }
  };

  // 단계별 이미지 업로드 함수
  const uploadStepImage = (index, event) => {
    const file = event.target.files[0]

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택해주세요.');
      return;
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSteps(prevSteps => 
          prevSteps.map((step, i) => 
            i === index ? { ...step, img: e.target.result, imgFile: file } : step
          )
        );
        // setStepImgPreview(e.target.result)  // 미리보기 URL 저장
      }
      reader.readAsDataURL(file)
    }
  }

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

  // 필터 선택 함수
  const handleFilterChange = (filter) => {
    setSelectedFilters(prevFilters => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter(f => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  }

  // 재료 입력 함수
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  // 재료 이름 드롭다운에서 선택
  const handleIngredientSelect = (index, selectedIngredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], name: selectedIngredient };
    setIngredients(newIngredients);
  };

  // 재료 추가 함수
  const addIngredient = () => {
    setIngredients([...ingredients, {name: '', count:'', unit:''}])
  }
  
  // 재료 삭제 함수
  const deleteIngredient = (indexToDelete) => {   // indexToDelete: 삭제할 재료의 인덱스 변수
    setIngredients(ingredients.filter((_, index) => index !== indexToDelete));  // 나머지 재료들을 새로운 배열로 만들기
  }

  // 단계 입력 함수
  const handleStepChange = (index, value) => {
    setSteps(prevSteps => 
      prevSteps.map((step, i) => 
        i === index ? { ...step, desc: value } : step
      )
    );
  }
  // 단계 추가 함수
  const addStep = () => {
    setSteps([...steps, { order: steps.length +1, desc:'', img:'', imgFile: null }])
  }
  // 단계 삭제 함수
  const deleteStep = (indexToDelete) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps.filter((_, index) => index !== indexToDelete); // 나머지 단계들을 새로운 배열로 만들기
      // 순서 재정렬
      return newSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
    });
  }

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault()
    const isConfirmed = window.confirm("레시피를 등록하시겠습니까?");   // 제출 확인 창
    if (!isConfirmed) {
      return;
    }
    const recipeData = {
      user_id: user.user_id, 
      recipe_name: recipeName,
      category,
      filters: selectedFilters,
      recipe_desc: recipeDesc,
      cooked_time: cookedTime,
      serving,
      level,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        count: ing.count,
        unit: ing.unit})),
      cooked_order: steps.map(step => ({
        cooked_order: step.order,
        order_desc: step.desc,
      })),
      tips
    };
    console.log('제출할 데이터:', recipeData);

    const formData = new FormData();

    // 이미지 제외 데이터 FormData에 추가
    formData.append('recipeData',JSON.stringify(recipeData));
    // 대표 이미지 추가
    if (recipeImg) {
      formData.append('recipe_img', recipeImg);
    }
    // if (recipeImg) {
    //   if (recipeImg instanceof File) {
    //     formData.append('recipe_img', recipeImg);
    //   } else {
    //     formData.append('recipe_img', recipeImg); // 기존 이미지 URL
    //   }
    // } else {
    //   formData.append('recipe_img', ''); // 업로드 이미지 삭제 -> 삭제. 이미지는 필수이므로 다시  파일선택
    // }

    // 단계별이미지추가
    steps.forEach((step, index) => {
      if (step.imgFile) {
        formData.append('step_img', step.imgFile);
      }
    });
    // steps.forEach((step, index) => {
    //   if (step.imgFile) {
    //     if (step.imgFile instanceof File) {
    //       formData.append(`step_img_${index}`, step.imgFile);
    //     } else {
    //       formData.append(`step_img_${index}`, step.imgFile); // 기존 이미지 URL
    //     }
    //   } else { 
    //     formData.append(`step_img_${index}`, '');  // 업로드 이미지 삭제
    //   }
    // });

    // FormData 데이터 전송
    try {
      const response = await fetch(`${API_URL}/api/writeRecipe`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('레시피 등록에 실패했습니다.');
      }
      console.log('Recipe submitted:', response);
      alert("레시피가 성공적으로 등록되었습니다.")
      navigate("/", { replace: true });  // replace: true를 사용하여 현재 페이지를 대체
    } catch (error) {
      console.error('레시피 등록 오류', error);
      alert("레시피 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  

  return (
    <div className={styles.recipeEditor}>
      <h1 className={styles.recipeTitle}>레시피 등록</h1>
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
            onChange={uploadImage}
            className={`${styles.recipeSelect} ${styles.halfWidth}`}
            required
          />
        {recipeImgPreview && 
          <img src={recipeImgPreview} alt="대표이미지" className={styles.previewImage} />}
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="간단한 설명을 적어주세요."
            value={recipeDesc}
            onChange={(e) => setRecipeDesc(e.target.value)}
            className={`${styles.recipeInput} ${styles.fullWidth} ${styles.lightPlaceholder}`}
          />
        </div>

        <p className={styles.boldSmallText}>정보</p>
        <div className={styles.inputWithLabel}>
          <input
            type="number"
            placeholder="조리 시간"
            value={cookedTime}
            onChange={(e) => setCookedTime(e.target.value)}
            className={`${styles.recipeInput} ${styles.quarterWidth} ${styles.lightPlaceholder}`}
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
            <DropdownSelector
              onIngredientSelect={(selectedIngredient) => handleIngredientSelect(index, selectedIngredient)}
            />
            {/* <input
              type="text"
              placeholder="재료명"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className={`${styles.recipeInput} ${styles.thirdWidth} ${styles.lightPlaceholder}`}
            /> */}
            <input
              type="text"
              placeholder="수량"
              value={ingredient.count}
              onChange={(e) => handleIngredientChange(index, 'count', e.target.value)}
              className={`${styles.recipeInput} ${styles.quarterWidth} ${styles.lightPlaceholder}`}
            />
            <input
              type="text"
              placeholder="단위(예:g, 개)"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              className={`${styles.recipeInput} ${styles.quarterWidth} ${styles.lightPlaceholder}`}
            />
          {ingredients.length > 1 && (
            <button
              type="button"
              onClick={() => deleteIngredient(index)}
              className={styles.deleteButton}
            > 삭제
            </button>
          )}

          </div>
        ))}
        <button type="button" onClick={addIngredient} className={styles.addButton}>재료 추가</button>

        <hr />
        <p className={styles.boldSmallText}>조리 순서</p>
        {steps.map((step, index) => (
          <div key={index} className={styles.formGroup}>
            <div className={styles.stepOrder}>{step.order}</div>
            <textarea
              placeholder="조리 방법을 적어주세요."
              value={step.desc}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className={`${styles.recipeTextarea} ${styles.fullWidth} ${styles.lightPlaceholder}`}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadStepImage(index, e)}
              className={`${styles.recipeInput} ${styles.fullWidth}`}
            />

            {/* {recipeImgPreview && <img src={recipeImgPreview} alt={`Step ${step.order}`} className={styles.stepImage} />} */}
            {step.img && <img src={step.img} alt={`Step ${step.order}`} className={styles.stepImage} />}

            {steps.length > 1 && (
            <button 
              type="button" 
              onClick={() => deleteStep(index)}
              className={styles.deleteButton}
            > 삭제
            </button>
          )}

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
              className={`${styles.recipeTextarea} ${styles.fullWidth}  ${styles.lightPlaceholder}`}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/" className={styles.cancelButton}>취소</Link>
          <button type="submit" className={styles.submitButton}>레시피 등록</button>
        </div>
      </form>

    </div>
  )
}

export default RecipeWrite;