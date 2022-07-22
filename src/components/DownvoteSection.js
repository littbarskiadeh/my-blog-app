import React from 'react'

const DownvoteSection = ({ articleName, upvotes, downvotes, setArticleInfo }) => {

    const downvoteArticle = async () => {
        const result = await fetch(`/api/articles/${articleName}/downvote`, {
            method: 'POST',
        });
        const body = await result.json();
        setArticleInfo(body);
    }

    return (
        <div id="downvotes-section">
            <button onClick={() => downvoteArticle()}>Downvote Article</button>
            {/* <p>This post has been downvoted {upvotes} times, downvoted {downvotes} times</p> */}
        </div>
    )
}

export default DownvoteSection;