import { ProfileTable } from '@/components/mypage';
import * as S from './styles';
import { Icon } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { removeAccess } from '@/hooks/auth/useLocalStorage';

const Profile = () => {
  const navigate = useNavigate();
  const logout = () => {
    removeAccess();
    navigate('/');
  };

  return (
    <S.Container>
      <S.Block>
        <S.Title>프로필 수정</S.Title>
        <S.Subtitle>대표 프로필 사진과 별명을 수정 하실 수 있습니다.</S.Subtitle>
      </S.Block>
      <ProfileTable />
      <S.Block>
        <S.Box>
          <S.Logout>로그아웃</S.Logout>
          <Icon value="logout" onClick={logout} />
        </S.Box>
      </S.Block>
      <S.Block>
        <S.Box>
          <S.Title>회원탈퇴</S.Title>
          <Icon value="quit" onClick={logout} />
        </S.Box>
        <S.Subtitle>
          탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. 탈퇴한 아이디는
          본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다.
        </S.Subtitle>
      </S.Block>
    </S.Container>
  );
};

export default Profile;
