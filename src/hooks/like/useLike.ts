import updateLike from '@/apis/like';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLike = (postId: number, initialLikeCount: number, initialLikeType: boolean) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => updateLike(postId),
    onMutate: async () => {
      const newLikeType = !initialLikeType;
      const newLikeCount = newLikeType ? initialLikeCount + 1 : initialLikeCount - 1;

      // 낙관적 업데이트
      queryClient.setQueryData(['likes', postId], {
        likeCount: newLikeCount,
        likeType: newLikeType,
      });

      return { previousLikeType: initialLikeType, previousLikeCount: initialLikeCount };
    },
    onError: (error, variables, context) => {
      if (context) {
        // 에러 발생 시 이전 상태로 되돌리기
        queryClient.setQueryData(['likes', postId], {
          likeCount: context.previousLikeCount,
          likeType: context.previousLikeType,
        });
      }
      console.error('좋아요 업데이트 실패', error);
    },
    onSettled: () => {
        queryClient.invalidateQueries({
            queryKey: ['posts']
        });
    },
  });

  const toggleLike = useCallback(() => {
    if (typeof postId !== 'number') {
      console.error('postId is undefined, toggleLike will not execute.');
      return;
    }
    mutation.mutate();
  }, [mutation, postId]);

  const currentLikeData = queryClient.getQueryData<{ likeCount: number; likeType: boolean }>(['likes', postId]);

  return { 
    likeCount: currentLikeData?.likeCount ?? initialLikeCount, 
    likeType: currentLikeData?.likeType ?? initialLikeType, 
    toggleLike 
  };
};
