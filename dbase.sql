CREATE TABLE trump_statements (
	claim_index int NOT NULL
	claim_date date NOT NULL
	claim_source varchar NOT NULL
	claim_text varchar NOT NULL
	claim_rating varchar NOT NULL
	claim_topic varchar NOT NULL
	claim_response varchar NOT NULL
	claim_link varchar NOT NULL
	claim_repeat_dates varchar NOT NULL
	PRIMARY KEY (claim_index)
)

COPY trump_statements(claim_index,claim_date,claim_source,claim_text,claim_rating,claim_topic
claim_response,claim_link, claim_repeat_dates)
FROM '' DELIMITER ',' CSV HEADER;
	

