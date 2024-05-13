import * as S from './styles';
import MainListItem from "./MainListItem";
import { fetchPosts } from '@/apis';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { ArticleItem, List } from '@/types/article';
import Loading from '@/components/loader';
import React, { useEffect, useRef } from 'react';

const MainList = () => {
  const loadMoreRef = useRef(null);

  const userId = localStorage.getItem('userId') || undefined;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess
  } = useInfiniteQuery<List, Error>({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }: QueryFunctionContext) => {
      // pageParam 타입 검증
      const pageNumber = typeof pageParam === 'number' ? pageParam : 1;
      return fetchPosts({ pageParam: pageNumber, limit: 2, userId });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo && !lastPage.pageInfo.done) {
        return lastPage.pageInfo.pageIndex + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // 높이 20px인 블록에 대한 감지로 다음 페이지 쿼리문 발동
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <S.MlContainer>
      {isSuccess && data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.posts.map((item: ArticleItem) => (
            <MainListItem key={item.postId} listItem={item} />
          ))}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef} style={{  width: '100%', height: '50px' }}>
        {isFetchingNextPage && <div>loading...</div>}
      </div>
    </S.MlContainer>
  );
};

export default MainList;
