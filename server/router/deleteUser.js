const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;
const clearToken = require('../module/clearToken');


// 회원탈퇴 라우터
router.delete('/', async(req,res)=>{
    // 클라이언트로부터 유저정보를 받음
    const { userId } = req.body;

    console.log(userId)

    const queryString = `SELECT user_code FROM users WHERE user_id = ?`;

    let data = null;
    let user_code = null;

    try{
        [data] = await maria.execute(queryString, [userId]);

        console.log('delete data',data)
        user_code = data[0].user_code;
        console.log(user_code);
    } catch(error){
        console.error(error);
    }

    // 외래키로 설정된 유저 데이터를 삭제하는 방법을 세 가지로 정리할 수 있음.
    /*
        1. 서버에서 순서대로 삭제:
        - 방식: 애플리케이션 코드에서 관련 테이블의 데이터를 순차적으로 삭제
        - 특징: 세밀한 제어 가능, 로직이 복잡할 수 있음
        - 사용: 복잡한 삭제 로직이 필요하거나 각 단계를 추적해야 할 때
        2. ON DELETE CASCADE:
        - 방식: 데이터베이스의 외래 키 제약 조건에 CASCADE 옵션 설정
        - 특징: 구현이 간단, 자동으로 관련 데이터 삭제
        - 사용: 단순한 관계에서 일관성 유지가 중요할 때
        3. 트리거 사용:
        - 방식: 데이터베이스에 삭제 트리거를 정의
        - 특징: DB 레벨에서 복잡한 삭제 로직 처리 가능
        - 사용: CASCADE보다 복잡하지만 애플리케이션 로직보다는 간단한 경우
    */
    try {
        const userDeleteQuery = `DELETE FROM users WHERE user_code = ?`;

        await maria.execute(userDeleteQuery, [user_code]);

        clearToken(res);

        return res.json({message: '유저 정보 삭제 완료.'})
    } catch (e) {
        console.error(e);
    }
})
module.exports = router;