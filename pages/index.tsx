
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

// const API_KEY = 'ab3e1c2d0848448d89c7507562be692d';
// const API_KEY = '3dca850f427344f29dc7600879b19f1b';
const API_KEY = 'b9ad8a6a0a1546e4b27cacfa3b2777f8';
const API_ENDPOINT = `https://newsapi.org/v2`;

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}
const categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']
const sortBy = ['Relevancy', 'Popularity', 'PublishedAt']


export default function Home() {
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [category, setCategory] = useState('Business');
  const [sort, setSort] = useState('Relevancy');
  const [filter, setFilter] = useState('Everything');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(API_ENDPOINT + `/top-headlines?country=in&category=${category}&sortBy=${sort}&apiKey=${API_KEY}`);
        // console.log(API_ENDPOINT + `/top-headlines?country=in&category=${category}&sortBy=${sort}&apiKey=${API_KEY}`);
        const data = await response.json();
        setArticles(data.articles);
        setSearchResults(data.articles);
      } catch (error) {
        console.error(error);
      }
    }

    fetchArticles();
  }, [category, sort, filter]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    if(articles.length === 0) return;
    
    const newSearchResults = articles.filter((article) => {
      return (article.title && article.title.toLowerCase().includes(searchQuery) || article.description && article.description.toLowerCase().includes(searchQuery))
    });
    setSearchResults(newSearchResults);
  }

  const handleCategory = (category: string) => {
    setCategory(category);
  }

  const handleSort = (sort: string) => {
    setSort(sort);
  }

  const handleFilter = (filter: string) => {
    setFilter(filter.toLowerCase());
  }


  return (
    <div>
        <title>My News App</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_SITE_NAME} - Get the latest news from around the world`} />
        <link rel="icon" href="/favicon.ico" />
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">My News App</h1>
          <p className="mt-3 text-[1.5rem] md:text-2xl font-medium" aria-label="description">
            Get the latest news from around the world
          </p>
          
          <div className="w-full md:w-5/12">
            <input
              type="text"
              placeholder="Search for news"
              className="w-full p-2 m-2 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-500"
              onChange={handleSearch}
            />
          </div>

          
        </div>

          <ul className="flex flex-wrap justify-center items-center w-full sm:px-5 md:px-10 xl:px-20">
            {categories && categories.map((cat, index) => (
              <li
                key={index}
                className={`${cat === category ? 'bg-slate-500 text-slate-50' : 'bg-slate-300'} md:p-2 p-1 m-1 rounded-md cursor-pointer`}
                onClick={() => handleCategory(cat)}
                aria-label={cat}
              >
                {cat}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap justify-center items-center w-full sm:px-5 md:px-10 xl:px-20">
            <p>SortBy: </p>
            {sortBy && sortBy.map((sortType, index) => (
              <li
                key={index}
                className={`${sortType === sort ? 'bg-slate-500 text-slate-50' : 'bg-slate-300'} md:p-2 p-1 m-1 rounded-md cursor-pointer`}
                onClick={() => handleSort(sortType)}
                aria-label={sortType}
              >
                {sortType}
              </li>
            ))}
          </ul>
          

      <div className={styles.main}>
        {searchResults && searchResults.map((article, index) => (
          article.urlToImage && 
          <div className={styles.container} key={index}>
            <h2 className={styles.heading}> <Link href={article.url} target="_blank"> {article.title} </Link></h2>
            <p className={styles.description}>{article.description}</p>
            <div className="image">
              <img src={article.urlToImage} alt={article.title} />
            </div>
            <a className={styles.more} href={article.url}>Read more</a>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
