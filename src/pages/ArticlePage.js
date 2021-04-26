import React, { useState, useEffect } from "react";
import ArticlesList from '../components/ArticlesList';
import CommentsList from '../components/CommentsList';
import UpvoteSection from '../components/UpvoteSection';
import AddCommentForm from '../components/AddCommentForm';
import NotFoundPage from './NotFoundPage';
import articleContent from './article-content';

const ArticlePage = ({ match }) => {
    const name = match.params.name;
    const article = articleContent.find(article => article.name === name);

    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });

    useEffect(() => {
        const fetchData = async () => {
            // const result = await fetch(`http://localhost:8080/api/articles/${name}`); using proxy property in package.json
            const result = await fetch(`/api/articles/${name}`);
            const body = await result.json();
            console.log(body);
            setArticleInfo(body);
        }
        fetchData();
    }, [name]);

    if (!article) return <NotFoundPage />

    // get other articles except current article
    const otherArticles = articleContent.filter(article => article.name !== name);

    return (
        <>
            <h1>{article.title}</h1>

            <UpvoteSection articleName={name} upvotes={articleInfo.upvotes} downvotes={articleInfo.downvotes} setArticleInfo={setArticleInfo} />

            {article.content.map((paragraph, key) => (
                <p key={key}>{paragraph}</p>
            ))}

            <AddCommentForm articleName={name} setArticleInfo={setArticleInfo} />

            <CommentsList comments={articleInfo.comments} />

            <h3>Other Articles:</h3>
            <ArticlesList articles={otherArticles} />
        </>
    );
};

export default ArticlePage;