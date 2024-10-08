# MODEL OF TABLE
-- public."transaction" definition

-- Drop table

-- DROP TABLE public."transaction";

CREATE TABLE public."transaction" (
	id serial4 NOT NULL,
	"transactionExternalId" varchar NULL,
	"transactionType" int4 NULL,
	"transactionStatus" int4 NOT NULL,
	"valueTx" int4 NOT NULL,
	"createAt" timestamp NULL DEFAULT now(),
	CONSTRAINT transaction_key PRIMARY KEY (id)
);


-- public."transactionStatus" definition

-- Drop table

-- DROP TABLE public."transactionStatus";

CREATE TABLE public."transactionStatus" (
	id int4 NOT NULL,
	transfertypename varchar NULL
);


-- public.transactiontype definition

-- Drop table

-- DROP TABLE public.transactiontype;

CREATE TABLE public.transactiontype (
	id int4 NOT NULL,
	"name" varchar NULL
);

##### SCRIPT OF TYPE TRANSACTION.

insert into "transactionStatus" 
(id, transfertypename)
values
(1 ,'pending');

insert into "transactionStatus" 
(id, transfertypename)
values
(2 , 'approved');


insert into "transactionStatus" 
(id, transfertypename)
values
(3, 'rejected');



insert into "transactiontype" 
(id, name)
values
(1, 'credit');

insert into "transactiontype" 
(id, name)
values
(2, 'debit');