CREATE TABLE all_tweets (
    text varchar
    created_at varchar
    retweet_count int
    favorite_count int
    is_retweet int
    id_str varchar NOT NULL
	PRIMARY KEY (id_str)
)

COPY all_tweets(text,created_at,retweet_count,favorite_count,is_retweet,id_str)
FROM 'trumpTweets.csv' DELIMITER ',' CSV HEADER;
