-- ============================================================================
-- IMPORT / UPSERT DES 27 PLATS DE KHADY'S FOOD & EVENT DANS public.dishes
-- Source       : src/data/allorestoData.ts (RESTAURANTS_DATA[0], id = resto-khadys-food)
-- Cible        : public.dishes
-- restaurant_id: 99e2e632-4efd-4a44-8754-b806b50babfe
-- Mode         : Upsert comparé par NOM normalisé (sans création de doublons)
-- Généré le    : 2026-11-26T11:01:00.707Z
-- IMPORTANT    : Script préparé uniquement (non exécuté automatiquement).
-- ============================================================================

BEGIN;

CREATE TEMP TABLE tmp_khadys_dishes (
  source_id             text NOT NULL,
  name                  text NOT NULL,
  description           text,
  price                 integer NOT NULL,
  category              text NOT NULL,
  dish_category         text,
  image                 text,
  is_popular            boolean NOT NULL DEFAULT false,
  is_vegetarian         boolean NOT NULL DEFAULT false,
  is_vegan              boolean NOT NULL DEFAULT false,
  is_halal              boolean NOT NULL DEFAULT true,
  is_spicy              boolean NOT NULL DEFAULT false,
  spice_level           integer DEFAULT 1,
  is_gluten_free        boolean NOT NULL DEFAULT false,
  is_niger_local        boolean NOT NULL DEFAULT false,
  is_express            boolean NOT NULL DEFAULT false,
  is_chef_special       boolean NOT NULL DEFAULT false,
  is_healthy            boolean NOT NULL DEFAULT false,
  is_daily_special      boolean NOT NULL DEFAULT false,
  is_menu_du_jour       boolean NOT NULL DEFAULT false,
  menu_du_jour_includes text,
  meal_moments          jsonb NOT NULL DEFAULT '["dejeuner", "diner"]'::jsonb,
  meal_service_time     text,
  is_available          boolean NOT NULL DEFAULT true,
  preparation_time      integer DEFAULT 20,
  calories              integer,
  allergens             jsonb NOT NULL DEFAULT '[]'::jsonb,
  options               jsonb NOT NULL DEFAULT '[]'::jsonb
) ON COMMIT DROP;

INSERT INTO tmp_khadys_dishes (
  source_id,
  name,
  description,
  price,
  category,
  dish_category,
  image,
  is_popular,
  is_vegetarian,
  is_vegan,
  is_halal,
  is_spicy,
  spice_level,
  is_gluten_free,
  is_niger_local,
  is_express,
  is_chef_special,
  is_healthy,
  is_daily_special,
  is_menu_du_jour,
  menu_du_jour_includes,
  meal_moments,
  meal_service_time,
  is_available,
  preparation_time,
  calories,
  allergens,
  options
) VALUES
  (
    'kf-suya-brochettes',
    'Brochettes de Filet de Bœuf (Suya)',
    'Tendres tranches de filet de bœuf marinées à l''huile d''arachide et aux épices Kankankan (piment rouge, gingembre, arachide torréfiée), grillées au feu de bois. Formule Plat Cuisiné du Jour officiel Khady''s Food.',
    4000,
    'Menu & Plat du Jour',
    'menu_du_jour',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    'Plat chaud + Alloco doré croustillant + Piment vert maison + Oignons doux marinés',
    '["dejeuner","menu_du_jour"]'::jsonb,
    '11h30 - 15h00',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #1: Brochettes de Filet de Bœuf (Suya),
  (
    'kf-sauce-crin-crin',
    'Sauce crin-crin (fakou frais/Ademe)',
    'Sauce gluante à base de feuilles de corète, mijotée avec du poisson de mer et/ou viande de bœuf. Accompagnement : pâte blanche de maïs ou pâte noire d''igname (cossette). Spécialité authentique de Cheffe Khady.',
    3500,
    'Plats Traditionnels & Sauces',
    'africain',
    '/images/dishes/khadys_sauce_crincrin.jpg',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    'Sauce crin-crin + Pâte blanche de maïs ou pâte noire d''igname + Poisson/Bœuf + Piment vert',
    '["dejeuner","diner"]'::jsonb,
    '11h30 - 21h00',
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #2: Sauce crin-crin (fakou frais/Ademe),
  (
    'kf-spaghetti-merguez',
    'Spaghetti au Merguez',
    'Délicieux spaghetti sautés au merguez épicé, piments doux, oignons frais et herbes aromatiques de Cheffe Khady.',
    3500,
    'Spécialités Africaines',
    'africain',
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wgARCAFoAUEDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAgMAAQQFBv/EABgBAAMBAQAAAAAAAAAAAAAAAAABAgME/9oADAMBAAIQAxAAAAHnsqcvTV3YQqgiuKajKIcqKB4Au5cqm1MEEUtg5nNHDzg6AYQIcsiUcsiUcWQGE1RUQDVwKujTtT8wrhQYyFUiYGElwBqC0yiK4XVlpGRW6MxDvFHPm1YIs7Bda9Ac3d0GsVqoxQWRiMvStHBHv4ovASzy0klSxatiZZ3qC4UVKIT0iqIRHVi0vVr3bZ4NGlbmgYsAHQ5PBrKS1r00Gde+hco+wdHLbvsWG9tDwXuAWWmAyoQhXJ69Bwj04sdTYJRdCUTqSJoMDuTqBUzrjt2ylWQgkYmrWcRaLWBZDz53oiLDSPPWo7U5m6mZLtjaW0LbkaDgU1rOO9NLJRiysG+M4bHZsdSupnYRkBBjKU2o7W2JyE1AmlEpqU0MgS20HPTg405X0clXOFCLnd9AcVX1m8PUXvON0ysGLas1kNhpNzMfQXSxgcoDk9dSORKLHUocismhZ757t6X1FhZgbLGKASWiwWlD+WAZ0znNUUbGTLISwP2213R41BWa06HS4fb6Oclg24IBzTW1mZrTSWVKsfQzVKBMaOdi7nAl65nkWwFt1z7pgtM96HoALVFUJ8pJasdSx6PPsy6a2xSlGjLOmMnu11F/NmU9is0Sc3Npm9ujjO0fULG/SHkuwpgGDrWy5596clKuT18gcGKg9jUaWuvMfUl7FNWiktTNI4XWz5Ln5tGSwxKzPcWDRJm2xlbcxqTZpUQDeoHwzLG6ajkisukKWh3rA9ihlgTM7WN5+7PcqUQtebhRla0Am/1nl/Sy4ssedawS4MFs5MTMydTSVDVaFrzbhka1SY9yNVLTmEoWfTCLwuW9zM+pDbOvyt6ne/k5KffLM+ptuTSixaNLmmB2vMxkaPPoyzXT9P5f1Ys3B9BzsdMfTwak5zG4ULhRtQtzN6NyrchlSxrrWrVzTzzaq2p0gYto1Y/NsxsC3YpbNPP21WnscHrEtayVLLVVLHdVaTGxrg5tOeK6frPK+pazo0Z86Vi28qKHPs5yoroW6dm23F4n82k52boTTOlgyRPaU28YxktuugBfLJ6OLopqgoXRipi46PtcvtVppEQqXyqDKGjPpNwY1xM+pM11O9xeuADRS18js4IaOZrzqkMZmbvUnRrCedudAnXjFV00Znhodl15Zll1YZt2PdztVpWYOhV1eOY6LzORv7PH61URq0NwSIEZHI0m5Izg01EvudbndFGY7tOZNqUcrneh89CLOQOqYN0z6PI7uK54asVVtTpyUaEsxi6g5NHOtfI08rofQ0IYq08fWmsczosOl0eG1aeid5FjPWGjRcYM23FauVA5ObVlR6TVh2yzEblnDyBXL6XKzpa2QzxHGNDrSw004OsnJO5HY8zrp0gz6LWXq8zbnYYuhkab0cb0ctW9Vwh+gxq0KNCK3hS39TLruE8zr8qkU1wPOZzcHa2c/ryIq5LgtAePidXkTU3ctqOrmyDEs0Vkc62LKdBwbMt1m1530U5S5eiqbIWLTVy1g1nGnTHasSdbQvptKWQ0h5/QwMXFxrg9XldZNvb425GpbwQmyqWtOgU8GLv45ri5/RZhozyZYpFy71ZnhPRJLNjkzSTl3ZSTO8mkljBZlO3o5dOyKFdhMA6mDdMrmb+YypI1wujztQdijFPpM5nRRaniCRuRWZgsis9NKXxcvbzJZKsc8WZiz6dd2Rz1Ls21hLfZlytGk1Kd963JknZqrOTSBkocUvKwkEhpk5ECgalPt6uD3AFkAN7uWxG5JRFKORWdq2RSmVGJ5XeGZ4WrpgVwr6mXPqytb0HHF1TG57U5u+o2Rl6RHiVxKpLL5qYw21hZp4d0gY+J2RKztGxKdc/TzgdcHyxCzWSHlmiemKahNnUUcCwaEjFks0SMFrJm6OLLV2xOi4FpFpndQKB41gyynHYKbpO9q9cVUCZXS2qTEHBrmkyXpG/fwGh3747Q6docmUGATFRD9XOtnRrNpEEdELjIzPn3jNc7oqagqoLkuREspgcdhoqIrTGTTjIcdFQoFAYzUoraSGvPrCaYrSL14hDTYuFp3cHOn6qcHaHRiyC5VBr08uB15zDFvmCh7x56g142U0GeuQyhhJ1ppkuyu8dXLalDJI1ngyaZYNCqMUZo2axmoppCgOmmacFBvRn0sVoYQaNnKYHSiXhUbAWRAIqXlDViw5gMSYOnW3O1HR53JRIYNWgoMDNcgyZIi6kABkpKqRlLk2zWEjmSQDkgVUgFUjGNkRa5ATJB2ciG6pMdCqSXUkHVyAJyCuSI/8QAKhAAAgIBAwQCAgMBAQEBAAAAAQIAEQMQEiEEIjFBEzIgIxQzQjQwBST/2gAIAQEAAQUCP1nv3D59ntAno+J6uFgJvBO3M02PYS4VSbUm1ZtmzJCuWt4g5Cz379+vQh5J1Hg/af59eAPA8iCeToYWCzvcbVE34xPkyUWM40ASNtC2ICs7ZZnyNOyATdtPn/xqe5/mHT/PomeIIWF7HM7Ejsz6boWJ1uboWuAwWSmFzEwqIANCimfEsbpYwyY5YM9+57OnrQz37Pg+J5JMCEgMqymafDkn8Z5/GM/jT+MZ/FaHp3E+F58DwdOYuBBFFf8Ajk6ZWh3Yyvj3PcbwND5EEPn3AGYqiof47NFxIv4VAtn4xCiCHFKGJCAyQKTBiefC0+Jpsb82AIyYWxwEECCe28CVP9ehByfag5JjxcKESE/guNjPE7YVgMVQHgoxVQS5uly5c4MOMQ4yNK/DNgs3Bo2lwT16WIPkONPwJgUmKgGh0yZBAZyEh50sfh6ly4QDGQrPP4Z8QIU6e/VT0I3hf2TCmtQ8wKBBUuExhweIo5FxsgWN1Bn8hpjz3AAYWqDmWJXAUg2BA27VsdzxK1z4hAYIdPQlfI2EfK2njRVqZBa4/ANwRiAHflcigNmqcmChPMCmkbZNw3CbY1q3kFtsqGDRl3TlSRrlxUyz3PXLMQIqhVnjRRUuOdwg7RzHYmNC25i3G4mMJgFuzBA+TeRYmPIbU6evsPMJgg0Zdw5QkaOodTdryI5oIPjx9MlaCGIsOnjQtUY8FuW7cZ4iiAy+5chUl90UQttF2Mb3qq0eL4gZToL0ddwHEOnUrAQDMY3Pus4hWMQmItk6XL0fNN5LOY1sagEYccWi8rxoyXFUgYuGsUDzCYl2ksXrlWLDxPIrY/xZo9JBy0MHJAoS5Z3OaGTJuLOFhybnUhlM+NYkz+aYFXKwOIvM2zie1eJlBbyRcXbK0vvDXBow2nyJ1izcdMP9w8TEOGh8ljfM6nJ3NvMVBNqgqdrfYDwmRRkdop5YI0IqCAkKcgggQ0e2LlIH8hZjZXC/U+aMEGmQWAahHOdd2GGdPzmJi9zDgGGNxHasbHu3RibGSbphbjI/O0kkdhtCG3QMtCoKj1Eebmha4tWarEduVIPPmHwurCmHKnxshmLsQPcwLLA1YcZY+IfFlx8hSTtNhOAjCKoeYsfyTIpSE8KpATFujqcZTwEuH7C52y6K5OMPOVJ69+/A0zDkGi3EvTLxMB3ZBxH5Aae2mWbgcbkXL4LwExVEXsbK+9gLyXQHaj90VZum02vIYwguyYmvHjCTEKhKzd2zzq9UYeUmLnK5nQ/33pkYArkE8zL9Xc3uIgHa0AvRZVF2oYhcx8hMhbI4FcUoADHvURhxj8/JBmsHP2K5EVvkB5AomARhovjbMXGNp0H/AEVGEyWJicGKecrCmKzaCTwBQbwcSQTK6if2TEoCsMd7Aj32/wCiLj0rJHoqAQSvdvCgZCWES0dfGPGEbHd3DD5Xz/HnjAZ0H/RDMqWwwKTu2h+4sIvEIjBdq9zLVGqc/IbpMDcZVm2CASuXQEY720aZhuO0q8TyIDMJJUDjzoeBpuMy8CdD/wBMaNLqAxnlg65PGMdkyvBxEpgLmLIHX6tnTaSp2UIxskqsLFhRRgeXVb8MRwLmMbEHg8wA7W8kUdOo/snQf9EMYBjl+i/2dhU60WdQRGMb7LyUTnaTDePJe7GpQqL3UIPqoop9XApPO6ZG5MwfcLcvRD2HkZfOmVbap/8APH7TG8TJynK5PjULk4IbgMsRqaHgVZxpUBEBqHuYGpVRwNpbtFBMhtlEY1MCsRfK8xTzgr5BNtkWJcuZdcnmdD92gMEIMyrC0I5qZKC45UcqzbRtJ5ncsWyWExm0ug1zZ2svxsnjINwVNnSXQIaXunSf22dwFEXUqObbTMP2idBPQErktM0fFxc3TILmNqjPxgAsYxMySu3bWHHDPk2ZPtPED7plIfMlQlZlr4CpAPcoNL0vD8uQYDAb0y8Ppm+06Afr1qXUyUQy0aucgiptEW0yBrUmXRy8BeDYMyfYPxzG7R/rGBtA7+repvNntAPPylCMuSFm3DIxmE7sczjXL9J0dL016KNs20I+2ZArNQji9DUCWvTt2ssyp+3qFsWAw7pk8L9lPY5JntJiWZmL5d3CoWJxVMaTgQ1OC3RMdsyi0084J0o//OI3heVjCsmRN8Yd3Jjb4VMKMqdI0rZlBhW3zNUHdkxN3M1iuVn9aL3TEpJzZNoXHvX4SDU3cd02CDFuX+EbwYviWGVztExc6dDzgYTyBU8RztGbJtxncQtqVaCdQeBxOMqC4LmXICPjouo3Kth/KsTMgLxFAm6D7LUZmrEtBcUGEQqBEWhANT/buMxttZ0/Z0fa08HxPOnUoSpJC/IYnMIIgHdjALAfC68y5kUvACmiGP8AUGbovEPjEls47hYi/sUBhF5g0A/B9R3InBBsGelh0Kgg9MlHBUZCsG5Srfqf9h4E3sD8rbmZjDQiLGHbtNLPCu8xtUBJI84ZURdsr9sH4P506bnHMLfldTiZEE2KyHCCCuyVNm+Lwfs2T7t5FgAwmxXOQwTcGiwDlMYWdwlwcwfg5/DpjwYIjbhK/A5ADStCtMQb6n7qbgjgMVKzN5QczYIA9/EwAQTyVTgecKGLxFu6/Fm2hvwwHbkGinaQbEM9wpyapahSOu6ECEVoO2MbYStELKtmEdmxqXGYiw+MY5A/F8oWDmGOwRf5TTIJ6xPvTyIrFSuQHQie4YPLAmfLzYaZMe4FagXcWwjYVglQA7QaiZFaVy8CiD6r+DuEDZWaKLjGMwUZchyN8TRPPg4smxlMOquRFyAxhBP9ZByt7eJQngbFabQgIsNiBnwtFxWUA25Em0wZDSm4BKg1yOEDMWIhOxXzqsdy8QVP3xl3S96zDm2FSCCPwBIga5YuVCNsHI4ocaEAwdsZbm29HUiCY8S2BL5GrMFDMXaM4xK7lzFFle5ri+SSj5ANMeRkmLqEeEfkGM3CNLjCoAaFwiBW3E7TPMPIqos5lak0MmT5GEZggyOWbQLUApYugOwuu06Yeo2z5B/4WDNwJHiptlSpU2zbMmPjGd34E0M2XeQIzDGMmQu2i9oVdo9QfXQHZHXaYZjy1OVidVFyK353UGWBgfz2DdozBRlyF4Fj5FxR3LHQALAOfR8VP8DX+uOu2XKiuUNpkjYypXPkSL1SmKwb8vEXLAwP5FgI2aGzNky5ggJJOlbYogno6N9RoIZRxwqCJ50TKVH6skbEyzwU6nIsXqlMV1b8t7CfK0+Zp8rTex02ywJlyUCbMC3PqVWp6Wej5j6jx7M2nfwxKlTCNFyss34nnwho2JxKIi58ixOpVp5/LaZQEuEzJmCxmLGBYLIAA09LB4/1H86Ce4vlwCtsooPOZdag1FzOJ8034jP0RDjWDPigfG04libpcJqN1CCZOodtANFSH6z16WDV/toINFj6MoM3uJSNCpXS9Lly5cvQZHEHUZZ/Iyw58hlk6jmBLg4npvAh8f5WN5DXp//EACARAAICAgIDAQEAAAAAAAAAAAABAhEQIBIwAyExQUD/2gAIAQMBAT8B2cjmcmWWWzmzmX1uRfUpl7t0N322Rlq2N3qhl9MZXo8rEVZL0j2xRIQsl4q6E7xJ7RlR9wvQvJFC8kCdX6wlqjluyyOHE4sj9GuyyT/CjiUlo5xGxdKxQ1YoJYeExlH0orogxlFDerFiLvD3Qs3lrFH6MbFJl9Cw8ULDIvMlhdCJSOdirXg0UUS+lCKHvXoaEsXm8PV7rD+EHmtFl9Kw/TItMSK/icbPjPH7FFHkhWGUPrQ3hoj6I+VHk8h9KrD1oktr2iyWyWZLpvCkN3qlerj3pXu49qj1NdKEtv/EACMRAAICAgEEAwEBAAAAAAAAAAABAhEQICEDEjBBEzFRYXH/2gAIAQIBAT8B1oUD4ztRSKR2o7EfGNeJIUCvE4FUPZKxKs2WWXvVko6pWJVi8tsR3IUryi9JRHhISrLxKVF+xsirOIi6llZvSUaxBauRLkRdsqkNlEHxhuhaNHZso/o6woc47EdokKRfheHLnHBWjHi+RYT2kJ2OPJRWbG3eaxeFhadRC4LvCxRypCdjsUrwuRoRRerJLKWGNWLjgsiseznDFtLCPocqGxHUXsTsSEUNCysPLQ+BDZ1CDGxq0djRF2i9Vl6NsssmrRB0xcvDPQiyy8LL0Y0hxrkj9DI8FjR/Ci6eVvWJYsvN4Z9sjwiheHn2f4MtouxyFIssihbJ3oxkVWJQs7aHFkI2fRZQtbISrWisUUIomiIlrJ+swl4aw42RVat1rGf753KsLWM9aKK2c/wfgsT8LG8vP//EADAQAAEDAwIFBAEDBQEBAAAAAAABESECEDEgURIiMEFhAzJxgaEzQpEjQFJiscET/9oACAEBAAY/AutKnKiqR6X8k1+nT9n66fSE+tV/B+rWfrVfwR6yfaEVUL9k+mv0THzdP7JV1SctEbqc/qP4pOT0k+VMsZ04vBM/JNDfByeoi+KjnpWkjSv9huo9a8Cfk5KX8qSr9KCYJkxaaUIgejlXwc9L+UI6SaG0PVyU/k/poYVSEYlUPce49x7kt7VPaSpuR0Xo5ahvURvPVS3DRKn+dY/qKY1YO5yqPUjqcVMWhD2mLY1sqOg/pzTt1YinuoyctP5UalLzdsmDIwqjZMGE6MkaOKiFFRYXa6a9qEypKMnanRGqPcTkXc4sKQZM9LzofHnYar3JZdW1CZUSpUZP2pebc2nIq2kik7DKlo0ZW0XgZdGydl2GqymrainKmG9OnCaZ1qi5OW3MQhgTiGFtS13SNLKOl27ftXbwTlM3QSinKiel6eBKU7W82mzWYmLOOStmGlkOZCB0ObQ5C63TFmUX/OnPlNH+9WTis9n0wg9vmz35as6UvkbuOpFWllunq05QdPbV+FsvqL7aceR1E6LUz5FpUdidDOOl/cM6E2RN7SjCy6EppcZbSVelVg9/5E9OnCCU2bT4syEqOmSnfuKtm7nCp56DlWxIrXwLqSv6s5SPZ7slmHOaz9r1uvaB2JNjcgd1GqImyDIYFa8a6kulm0Kp5tkgm3i3FeDEmBu98kiEIU2VbRoY+NC1/SW4ryMtnIti3KKtSisuBlKkUwbEK5Nms3ezCaWui2W6UbCU7jWkcmzLaLQZMiLReEwJut4HtjBBNlM4H3H0TZ7J4t9XySt+HFl5m3s4jEi2UWRUs2rNuXJBSowyDWaypaur6t9aOFc6Fs9pvAkDMPaCVYZh7KZi8iVpKD7lVQu2qlN1smh3kkdfq0WTcySj7EqYOFRlyONb5uhOBqTu41pIE+bbJZ9FCeLJqez3a3DZqiMoSTgdBxBWwebeCRP8rYsm9mckTyNp+rz2FszzpWdEkCVItl4ssMg9IptowJwtaVtwnPTgcRdC1PZfjQtnVeYa72dZtIxvoRUMCOJeqq0rgnJMwJbcwMwl1tV8avI6j2gdThTAl3TuO1mGGMdhlHtV8CMcSDrkV17DiqhzX+LravSpm6rb/wBFs5h1KbZPF+0Gbcov8EJ2ESkYVdkM9B/Fql86cHCvcVLZO6WezL3FpUpRRm0+dFNKDrtZ0FYyplT3KUy9kW9C+NXkZx1Hs6It6m7DKOhRVup5JXA+CLqt3Uq2GJtvZxRaWhO9lv8AC2pst0Hvm1SnCve0jeRVsyj2YVah1twU2lB7MxIyQcqjd7tZad0s2y6F8jj/AMEnizHDvoc5kg/+nprxU2+bIinChuxA6mTDoe1/keE+EtCE6VsiioNvqjsYtBmzL3KthVf6tgjF3EF0NSO5EKe4zrqXdb01D65QdiFs/Y+ME5JSSFGUmz6E0TdRfjU12tw9BhtjlGUhT4PI+iTF3XAzNZtzc5emo/QZUMjuZMdruo1NnW7M4466OJRuhOe+j5GvF5s94JQmi66GtmyQOpDdCJU4qrOp7RK6cKQPeOgk6WQfQ4r5G72RBtUm1mTCDqeDAvpLir2/NvA6D6NtCEmHvgweB072lThTtdhHH1OtmIlSVOJexkY4v3J7rMuDwvSizEWkYjJjQ+p1Hs657Erf/Wm/Gn2m5xU+1cWj+BlhejuNebe67IMNqdTxZ1+kHW/AmVz4Istmq/Tq/B4vw1YJjz0J6Tpk4dLJi052HVbov7lwh576uGuaP+Hi0DLg4vRqjY50/g5V1wSRrdLyN2tvV/wm7qjr2Qdcr0GWfTX8DpKL3vBPKp/6Zf5OdGOVX1QcxC6pU5SR1hBqdEzV2Qdc9JeFHo70nF6aun/NHjYjkUkyTPycyMQr6snY7WzaYIHUe7UzV/w3XUmrioVqhlair8KToyc9DLuhyVopKWy/yc3KRrlSLMkqOtnWEOXlp33I6qkje+nY/pr9dxl05OalF+ifTb4U/ehy+pUn0TV+CK3O5i8kT8EQl2p5lHrldTdFdDLzp5yRUy7KSnSipT3HuPepK35Uc5lIsnQ//8QAJxABAAICAgICAgIDAQEAAAAAAQARITFBUWFxEIGRoSCxwdHw4fH/2gAIAQEAAT8h0QyDDN4bMNzSSrX4igeWEaJzDFoi9wbCT9QZAGQO3Uq/tCWKbIm3vUXl/qjx/bOmdGz/AASGyXl3KWrrwiMNM0ZlGLBkR/aMdJgk0vuBmEwVzj6JXiVjfwrhh/KZRk9EqFxZePjaIFpdar0yO9rp/wAzsjtthrU+Covb9rHLcsiKVZwVQ5LfCcMZlG6emFNKnhczyi7dR/8AEDLfbFYgitWVOXwR0R2TjyznwxOajAxHDE5Pn4cAhwRcQwQ2e4GJKiu5p8RU2aCaA6oGzK98St4weZganKairLldQqYmL4idw0CrOGjzNGt5gND8SvH6mzv1MVWDxs/ELb+h+IY4Eiiq/gZ8SB+2dpsTqOEwKc/GogXNXPFc0wb9R+kgmWXb/tTE0eXcv4gUKpeWXac7j+I4f6R6v4jwrOGH0/Bicj2zhB6m0teYJoh6hCH8eI3+K0z6HODOWcvBDmGXOZtnCVNJObN5lCYpq2Eis/UrNeTgnBn9zRle3MYxIojVErOcFzgzqH3ESwyvWGyUzdD9RHKHSh4fzKoqviv4KzJwzand2eo5T7mkOLh8AfDlDD8sMFs5PUtTBjyXvgJ+QRX1HLEr/CMB1R5gItBRcx8TIIvTL1e4Irt3mVimR3ACUL3NAX1KmpSV+GO5cU6xNFn1L4Ey2v5fMtG8vfuGqp3GAQcLNhD4ZWw0mrSgX1FZX8omMan6vfyF+DuAFYnc1uu5w9ssIsss43AYF/0mtOkVS7TLFA9ksaVZuXjMY41m7l94i43OmWDTD4NufcyBkgmDjtERp+aU01/xqLaVbCGoycReGFNJhlA2bfvkx0R9Pn380C/xiYQH8ZQYcRlNG4jSYuAS5eQ/uXMtR56Jpfcynf6yxTL5mUPxMUC9+JTLc+uUcGZQ0S2/BafcIWWDLcPEaZ2fIS1eE5/6j3r/ABPmaTh8uEzMwVE/sR+Sttzb3N7aGt4qWDe2Wl6gmdMtwL6JaqJuKkJ7SJmRjS/2jleNgwX+pmVQmbhcGekjMIq+yXD1YQuZ1CxTaC3VkVS4QzE4RArg/r4QSnJKK9L7kJRBTUJtMpjIPOY9EZxT+XuamPhpb6TK+Yee0pPAIjWMSlDMut4PMZ8RV6SgAsBNRUMTifYYpZBxUJOAcVMnajibSkBCwsm5VS4aTK4ep0RRN5JuBQzR/wCYX/Cvh3zTeHGJVFNMqU3qKlv9LxATtXwKLfUVuZQX3x8BRpiCxF8zCNvMBzWRlXzGKu9IkYsuYM2Z61MljUV4IQ05lJ1AhtStVp0kNZxHVPM5DXU2CjaK+wjNEsvi8xRfc9hxFdDHJBXr4cPIfUIbvX6JmHmeEdopN0onLlgvejcsZmnRFBtY2sHPcLAsu8riBSNO0zoa8yoMFPE0hmTXM4pVbmZXK6uE+Bm5sp3LO/1Fd/1mVCemdRZa1FKGnMG9QuZdw0xeSGiyHxLMCmDmuYZyfGCv3EObHD1BaniIIZDiU2ni/wCmeBGQb5e2Dz7mGWiKseIEA3ArIuSG0vJVekBLaCUGvghwCp1MxPSPg5aeZ+RFAxSGGFvDaBOp0wxYxoOZ6HuU1SfVmBmdYlb1AixxBvXjESlZ2zxN7gduYVuF/FzLnhFEl6ccT858Zy9p7oO4z9kw7HUWfexUTT6hK8Hk3MQ3iDoEt4KzMVfuEav04hW0bJnlxMbmkMc5fMtWVvUNxkcku8Blb4SsJWeSO3ZMFoR7GpcTmVGVcvqZ2QL5jHVLlbaCYXbcWpczpslwZVhp1PVFnw6K+BNcaIKO0GAmbGfr4GvTbUe8BnTxC8ARE7Te1uY9Nr9TUOp0TMD7TmMTzEscXtMxvXmY8MnMscTI008RvxpFxd+I6i45gxDdbjIOcM0qC0McrGNOyLvmczcuoyDn+kyQ8k/7mX5ZRjbCpMSudR2GolsajcItBwSm3YBwxBcrsfizOLqZtX3GHCsZgoU31UWs30Yl2ZTUwlVzHvsG5mIGPJ5RA1iWuJ5JtpGnfqW3VAIOMzCif2lHBl5T9jEGwYOfgGYhsPhtjqbg59x+xTGDRCVc8SsraZV3JoQUb4lxgoiMHio4hWXBOlMm1K2VcF+bvJ3HRyBqYPtmQWeXMpc7GZ68SpqFH1omV+cBilhdR6QnoyhEA8wxOXbLCuyqJayKGSOGtcCNV6QJxXqCXLOnubNan1VnwPEyZcryw4u0UzzG34IAH1wT0YHD8TPH0Jk53LiTyw3L2uUmcmvEpsZQ4CtBVQCXHXiAjczxsgEYc1HZWo6xGpOVi2jMCxMgATv0y3t5gEDg8TJ3rdkQeja9RMbWbZqExrzAK5/tibKcQuYFPYjMu+fDzRwm01eVE8RaQZqOMxAUOE2OIcl5gLWsy2VZxU1LfJNAG+Jhsb0RHO3EqUqRPKtwXQ7zAlDBpUvmDpNkLVhbTjzNBQ9SlwPc6oLDeIySu5Z58yxw5lTeNTFb71Gw9hNN7jM/P6mSu1uEO0myOjPQh7gZtP02cTduIThPMR8Liaaz4hwjnSYq8zDlO7MtQ7ZgcNKmggrSECqetYmMFP8AcvOpmW6RsfpN0rmUXRCwddxd2zCcy1Yg3UZaxzNIUEXSC7nBFgwlTf2hhwRpdsfofuOONxq9D4J5J6D8f1WcQtypV0e453ol+ebjFLnjqPgyqq2Lg6VzxFRIugxtl5B5j6a0/mU0Lsl0npZgunZ3KWtYfEAA9fiWXPucoglL8QKXDBFjJ9syoAxAvf4APelBUeMTAuvuZLDF1Ft4WWZD9x6ASpNifSEuOnxicfQEDEOPhfDzD/HhOAVGlPxDICmmoa33Cmnghls0TgrCVBGdhFR4TXcHJlpX+CZI8cswzdwDN6nGTQ8zKqqcwnFvcxLxXvMbIKlC5zuO+kwFPuVNHzEwYVtXcIHAXeYnKJujmLRsdGpsMRRBi9k5lMFarcAYuZaLEsqtwCxYfPiYDlOJYstxK5M0VSGK5iNas1Hdtwj5l/iWfu5y31AOkC4NvEqGDfcFofZOdyQOb7IJZDO4t/U4DUaw4eIZYBTHmLzq5TKoGvMC/wDRDrc0uiceIm4gwLCAzG3BNI5mZmuMsDO5uQ2IkysgvUGnitS/l/aJgH5uUDC/E1VC5jwUvtCAG5u4p5U0QFMcWafMu9v/ALDwsXOzQMcM4fEyfiGTPUGpws00jTPLHshvVy18G8VFVDR1Lhes5gKWkci/UtT2JnoIssMcRkDfUQsvqFuahSXvWE5lvU2BzFmDb1GGqFLrRBMdwD4SppkErR2YZdoxRMVIpRGjUqx3yo4LthC5ah+4IbSjllVJWMxYBcDmO+WcTk4WIoLGftNl9EcnDEYAQ3n1HNDeMyryEdILEaAv/EbFtmeEHqP8Sry/AmhUC4bPPxnuZHsIbnskOpSNkc5JpiNlbwUjJ4nZhB8InMeJYVVHUWxcquEyZpmyROwXiYosqXvYOoYC5ZRCfcrAIcT6QWJnj1AR3zKvObjU3UYJ3lgmhoEJbqJVi4ANnbOV9ENZ/NMbp4uWJ0ZYT+o+MTL03wgLysLPiGTdMEtdwWFydzBkFlWCq5jAuGUGqIgojuCwceIjMhSznEzmpiB9AMwAQIVWtRmyDWjEtV3Bwc9TIuDiU7kdNEduLF2xFLPe5Y4C92eoO0+xGrNf6idguoKVixMEE9QzCUxM0uItnudOYELuVr6l3YcfGsS31DEC7gaHJzBXl4IZ0mepUTRc3BgTI6hYNIQ4VmQrOiBVvO4FtL+oTqsYhQeZYMMkshs1tXLRoIJbX9E2CXH/AIRgKpQO5cpd8Exch4hVzYqYrAcH7hZVrKwgsruCH5fHgkJHkw5YfYTNYVKsorKDxAbmwLesVKmbjGSLGH1NNVwfWswUI5/pj5LZMuVhPxF8xZEiR1dOota45QJb6JaLUqC9swcL6Mzey4LcGApRsepwG3WLZRiA8tsBorZ5YwCsfIwU/Wfi8CsoBriKziIlkSAUvzKpExUBMqpa72wVL/8AkFM6fcWtcIQaiEcBjCHxHmIIZcwLjPiEBgEvzbs7jkp4h1gzqa01jEcFyZhcyyy4U0Q0725i315iXAxzUPbQdJguWy92yQ8XHx/GwfETE1mHvKpirHEIE0wSsjuJqnZBybiWThR5j6suKh5b+42DTeSAND14lqtHTxiswFqCfazcHD1TEqz4j6LW6mgTNTfU2F+o5LiWEz4ll43AShKihLRdzAPzBiWhLcuoBIqysYZHHw0+VoWP6J9Stz7mBOd9fCRmz4bK4YNIjPnJNEF0uXHF5GWoPIMZjVZhH5jKnFsykRAiqLpBbur4irzn+SQtroln0TLHQ/cShJIAIh2QJnKJRQ83LFWS0bQ+TBOsxbb+OZiL03BeHMsNmyHbzz8MJUYk/IcRqNrn+GJRoPUaFZcgmGpUbPNcxDR7miqblFQXiI3mWVbXmOyAR7ETDyxc7gvHqFl1xCngRC8+iDkhSVxC3r4rN/DDud8EbpZZ+WdTCOsJnlzKRj2H3Du+AslNuHE9QbHPj4DTpuckoKFTxKNHrZF7xYjouJl4wTz+AYe0oAFEKM5TgEWqqetw3ROkHzAueEm7/GWYCBLeKK1Xcc6yeB+YXQ7P9Qb7JUcjcd3J8WBTEuH4sI4yhpgx5YOkQ0HNSlimjmAOGDgjJGPUXKsGSYLJXmMPIMRRk8JRaLhlHagJTFdMIo6gvOAD3DHzZFMZp4iKiBIQrROpnRPIjDD5l1FLiama5bg4Wxg4afnR5OmYZyhMO5i79TOdaqJW2iNvIQyWUzmjmUpnhPiV2ajM/wDgxLVNRKqKgXo7RnMf/Sbk3cezGoFvaaVD82l3wSwGYIGQC7YM/haj1/V1AKV8Dt6lzyOXD5j9cDz3MmI1yr/UvAj1Sp/hpGVg55mQVmX4lnbLUrJUFWZIOXHXwbQxMNLS5QvASgtyOYG6hCurhyXrUAq5ZUaqZ0ILfl2mCOF9QJyG6RqsxjVBCWHQeXl+GSlJ746kFS3kUG5e3xytQC/3Sh/hXJKtu8wPN+4NvEWqw8QAFKubBEWN+YK4fhn1TlFRMkw9x4VEBBktOKwUw7/JslBG8DRBOR/5I6yRgXiJwCz6QKhQTMGFO4TB2eXcXyMj3PU2XzEFt8XqU1qdcGFJZqX/AAuc+ZyFMKRYDR+CGYyrsh4xyuPhHaeHHc5zJD5BF0ROIy7LLt6/9plAfggxt/8A0pzNrK7Yz9zC8NRLw6lHY6eZ0lKyJzL6xO32lVK3sZzbt0nB98atXrn+Y9lRzW4Tl/PoTD4tCmMY69xlrbCaP8MMVWvwCtsJy6LZN7n+DuI0+KtR1DGl/MlaJwhNI2ZZVUB4nbwy/OuBMVj6jHI+9kHsR4f5Cq1U4R9k0A/y0ITgF+WNbdwofaMobS/mOlX4C2ArSz/llNtb2zaGY6yoqjQhObNKjsC2f4nkcTn2+E4S04jakeT5lbXhdRzDHZM3FHxMEgxvh/qZE/4iGlP/AGJ4IfHGLl3mDq8HmPZvbM0W8EdlPUZUEqikfxBXbU29/DnOFTTLmohgnEOE4TlMyhfuXW/+J6lIKMc/D6mPMOTiA0FIv4nOGI0ssYxOreoxQV+oILQnzmVKYNxXuf6hMdQiO348bQ2wLh1adjLAvycoIAYhpmo1YsflqnEdfC7h+EwBcL4eVs9Spdz3wP8Aca4G+pwVmWVmVE5TUqXf20V9iGe/0MX+kZq5fr4VPWOg/mW4A9RTtgC0HubteMD9KG4rClp/oJa3dXRN0Jq0W7k5x5Y5uX8PUXXx5Tibe0WIbmZSns3KWD8R9w/o1/uNUxLmUucYWjlPaeDL8zW/7nYy7/x8ELcj7jh3MbvEv+yjc46IAUKhiND4b4axVcVRUzuWT//aAAwDAQACAAMAAAAQmqrNkmsosUeRS7UQo5clBBJarDDB79NBU31hptPvjAA1W8n3omejcNkvc2dPxg90wdT6y9B4TG1bDf7zE1D9A7HbdnFr0yZ1JhMLHVH3/wCE8Yu0cAl/deizdmju2Z8c7OHEeKtf+JqE45Xm3sTwMekSBy8XdMeW6HhhFkGbzQ5DIpfqMUg7fPkG6HFUlMYNV6huK/HdBO/eypkjbUMcrDsR3UT1g8MIrlAgm9kAXmEA8QoM7tr2t/Ytm1e7THjvN0cNMrSQ9i89McjhQDuf/ZjrMKHPsLTTmp95QXAjER3DbvLpMsjo+bbjUUOPSuc6703Kyr8QtCgyZG8MscdWUBZb2fXxeNc+jyW1Rwf8oVveyyRRhQQcAIijeFzUk+za4bUN6mc0WvwLeAqPX245ychJ7EkwHDXaTBwvf4G9iXWdRRrtgaBj0JJyns5PLir26uNskIB+88TSEx/nHvHfYQwQ3wIHgHXYwg3/AP8A/8QAHREBAQEAAwEBAQEAAAAAAAAAAQARECExQSBRYf/aAAgBAwEBPxCPZi2HIS18lPsv+2/7xH0gfYD5xscfeGGbcv4yngt/QpMdMF8iI94ZgEvLILLOcs5EQsMWzAWjgNsYP7A9sEnyEbLJNsz8eBhtlw2WvOh2XbVA0lS+7aepB02/2OE5FLNd2jhyHGQrJh2zB3dZwtI7LQ2STl5+IdxPfl4THshE9s+X8WAdY/UfpZZMn4OAiMMDA+2V67smFqQxh7AOvZXg8J+jvUmN/Uj6iP8AZCBZduN4gncpOnlt7kyTOHglsLv0RjqAMARDsbthNy/mXI/VsLdsngmWS3vjzuddy5Dp1bSu9xojekOsk2N7IYO5ngjhfI16vHcN2hJHHbr7h7mydIOuodd8M8EcLPJNGB0SPwyO5HUH9s3q0Xs4b8Q06g53+YePkd2XpN7L7t6QvL4R7diPcn8IBszyzJe568nVvBZCS69L4ThBpMH5f7O9sHbW7lE/gYYnrdeMPCAg+TA7nyWLLZ7j8EwxKfLX7ALGmKF3aNLOu5D0Th1llu/lMcjjIlaWFpbekg7YEwgBNLLYOQtWhv52MXzbSHuX+W2xjJ2WOPYtnbCy+p+c4bu1ayDpxA/ODOuW+xxn6yyOc5wZP5B8kT3jOdt/GQbfVg5zgmbBO4jz9ZHA2AODyL7x/8QAHREBAQEAAwEBAQEAAAAAAAAAAQARECExQVEgYf/aAAgBAgEBPxD5PkHdmwWnyf7A/YP5H5X+Et8lvJR5Ke2WTJHlsElmcDvsE575OUH2N8l+oTfODoiVYR3bZjD+DYbeEdGU7JJOrOF6EAzhBb9l6vJJzufKAdQ27JPY1Dzn2Q406sGcLZTIM6gMNivsYk7SJd3jqfyIg8ZaNtsTWWWW9gPZObAScmYA2A6bfs2D3askww8bGcfJl6m8IXufhf5GakEn2knhfhMdMCHTY3YY5Xk3hhJz3eunqFsGw8ul0e5d8jwvF84BjherZZ3YL2kNYJ2ybC+Tt6id7v29nHcZ6wAyGcebyfONO5+p2tY7L3hIJWbfTYdkA2XTZavwldI+I4fYjt2Ax5x+EZCH3bWpGdQY29d250hAbBvkurGQ8Ps+R3D7Ce2FuhB7tO78Rhw2BvB77dWkcOC8cep8urQxgdCfe2nbe93qRMvxg7JT1ehdJ6NvS9Mbethvcc23uXPLZ5YgbGuSlt3mRy2w5ove8GG+oeuo4dxx2JOpk9hr3fFP6XfTdPksQpJmAwtekIm2D5A8ODh4TZj/ALdPL0tjka7lvCZ63TgPRfGQzg5ThOD18QHsIw3IhNtvZ/EpOr7sNgzgOQG8ZwI6XaLv7B3IyyJL6l1l36yIcOMiWxaMf4eDuzHLXAfsYsHYCX6cBecZmLLbUx5zlBgssWEYxn6PAXnBiVXbY8hyLzht7PXB/IQW8FFXvl8vkPch0wj5xt1/AyzjZQ7b5xP23qOrb5Pkex7KHqZO44G221ttmhpOsey98PnH/8QAJhABAAICAgICAgMBAQEAAAAAAQARITFBUWFxgZGh8LHB0RDh8f/aAAgBAQABPxDc5isOMy2MUR3U0ynHczPxluWT6ENfOpRYbyzY1dygJ7hn1IRHiZ6ncugVdzYa97LR14QZ1q0/0RA8ETPyxFGDg5gyZzZIGkVapx+YPWOlPzFnp6/sjKgOAfxAijcKTOPkGcq+YtowVLBzlZgHFCylnVqgRF5cQ0lMcygRgtfUVqm1zANAZl0XueyQjQtBKdpV8C4H3hQdmV25UyV4xAqekGQ8xbXRqZsLvcpKCPgyuE8bY2Cfk/Mx/wAqwPtDHd2X+UpPSkfxDFQu7EavdXcBcXXcPsDit2xIagxnbAYqVsisWni4hey6cQyfKIVFUj4QP5RvsPnL61KD6P8AqdMpipGlZPsjElCkbnNcDQ8rKJJrMBGnQSqU4UiWKaAmI1y1KNypZ8EXzmL8sXaVUukGU5QbeoKTuKgbXMTGkQW88QIW3crS8Adsc0nllfEORiZyL9aIMWOhcE7soaFZX3hpFMsPKAbYgFS3vuYzIDu4KwVQN0UFwotvUrT4lM+W1+oNj+jKcivIn2C1mQ+4vb8rmT5rs9r/AGWxLw69kcBG7IFsrAVcdVYjQGeb4gDm1bBjOBWUUKu8x2myPRtzKntMSkzoj/tlBZnUIZWWGyOhMxxoGIYQ4OYFsnf4SWdLpzL5ikqPIL+YnsnQTa8Jlh2Tw4lLq994q/zT/oAiz9Gle2+oyHxAjnG/JjInzlH4gQKcCoTHEqP6Sj0/MCirrxAz09Q/HXUPzGuidOopbmv84hvlK0zwV9xfoiXVHgnxGIaA7xFk8VBiLw+kRVi8ZmTVlQDfMuBmi5gc1RCOQpr2hA2eRa+Dn3BNnLAZ9OiVgY8qACig6CZagc7m8E9z53L1AsQOVckNIt0JbTGX4jCpdN9VuoyvnRcShopin00GfyYmDg9sFlPhFHLfWZZIiJw4llZ131MyxuuJWj5Jzhy5hXHubcQBZLG9ufzD+oye2hyPTKcsbZU05WErZomvWWWeq5lu2GWqzX/IKBWXDzROO0coijk5j0eZjina+18S11OUyv8AcNqqGAlqKvxDxVeEd4CjglqLWnCYaow2blCst13BbjMiQTCHiYUhtg/ERYAdpFchjhhggKEWKABDmqWGJTjMQLEAUg+Ej92fjX1MzjPl9Q7jO+SAC1fyfE52/v7/AOzf7+/vUFmAnN/v7+YQq27Y8P8AX33EteuJ/PqHI9su8qM6oXUOXdSnn7jbVfEvm5myDZ3Qtiw24MK6O2LUdU0O+yxtE43LxiLkvYv3MUF2Lb7iuNW2hF07HMQbljVg2xouhwe5f5pVpcMJlqXEtkwn4lllABNzGQ5MwIK8czWtk7iaEHvMABl7RmjQ4SBaNDzcKq6uCGWyUdXDfxMMWzk7N1+/EyKcHB9/v3HWB/a1+9dT1K/cfv71N5hsjL/WuPUoKJkd+TshxK3uMWvWIrd24J5z7mI7jaWZCUG1DuW5kxb8Dtip3089u1Of39/bnELLc6G3z4ixetAREKvX+oyoW1mEFCFxDsjLaHNczfwmt2wyJkZOUCm/iZNEWZKfM1FXbd/EM406wgiCWAtfTE8wm7QiK8gxGnvG7hbTcCFlPJDTmcW4mdH1cuYgcqwQxaRqUTEuTPwsWtscOz1GAHof3n98wuOb89wVcGFb0Pb/ABDogdtaeB4YBTM0/LPn8yqOeYVQ6I0yxWP8HmOgX4Sjgvvtnj+v39ohANm6YOvMVzZL3DAQ8TqJSsbHqWs8tdEALJgPmNWdu4idXEHvEHTpATcrqnP9QjreObTcBVUccvFRppekxAsreEYl5aqXCJphhybHuVgq04hbiKB5GG4afRHUpS/TFIurmsTdR5ChihdQ3eYiC7IWYtMXhOIoC1xwzkPX9dTMYgIUiXZCRvFf5F4ZmCwXIzO8DB/yKYLu2fhRDmWZ1IS35oqbCo/tfe5fhvr9/d9QDerStHcXAu0Eq/zCAJTLZe4x4WKJX5Bn5g6qPlZZhu2hjrC9rhIFWnRLDDA5fUJGNTazDZTa9Eo1mAY+Yvws2ZZX9BRgiYUdjBra1pbwsC4x3DS8l3cyL4LiEA1vEM20ORipRQ23Ms99R6xVMCJD9PTG2j3ehABffXl0zjOfU0H5D08P3AbAJ6B15D8RId5B/wCC2lAAbWGlQWuSwklWAvcWBv8ANB58xUVlndLR48zIu34lcVGLgZeWU4wOWW9g2ipYWDzMChWCVh0UEzBrhKLMbg0SKU3BzfhuBchBW4CUE4MkLEszaW3Dy4xZ41e2YRQx9TMvYeXueQjniO2bWFjANsGrWMU48ntKcUwWcSpDcXmAu4xsqWkxUGNQNOhldR8oMS4+Vke/38TiYQcaOeD8fwypwQflejsno/UKyxaMf4zKLZbeZaWj5H9JcXsKP1Gg6J2BfbM1EQBxiFrga4XH2kMzOms8sIWDWg9QygYF034jhEZuTE9wDTxEBdE1q5ppDYAA3HJl0K3LAPAf0lEqHlUsO8K97ww8wuTiKiwbHBmHa0Ri9w4WET0hnCkapibxnB/2WoIstqCaO4plIUi7Lh3tgXUpmZ5GGSX08n2IPSE+xx8RV3YQwqditkW5l9HR+J/8NGFM6fuMzFYJ9swIBlwEM8Ky9szJpohLUfmYruUoC88cx9IDCNYAyvEa2Ka1X5ZwoSzIzhDbuYs/TlUN/CZlBbCKeoxB8sEcwlUCoUStls9S0J7VxMSBtTUWZawkD2rhTSpwOZRGw7peIq0ND3nEVVsirXiaFQA6I5gsof8AICE9+iUqqvglsCxpJXYEvhl5maPFjDqr4xsgKJpICI5HiPkeWHEXO6y/JCVj08P2f2T9jEtM3qbLhP4jH8D/AFLfEOz8D1DX6joaYoAHlmRWuJk9GwaXzFnZ0n+yrF1rniNcwcLfV1DdQq7ZihbGdNPmUEFNxuKFcHaumviD4i24ENTS8CoVRUKAtZcC5BQfqDIx1wpDKytI5B99w1hFymoThAoepUBOanOS6ViS5Vs8xp8FmskK7mhhICpSgpyTJq/EKgTtS4mommaKqAINEA8x668uOpyacnZzPkguyDyx6SZl+fzKG7iBGNWuesRydYjB5tn1BAKAqWy5DNSxd6hg5E3E/wBVoZLu3LcHggu7cOLRYplIJTnuJWMVgDUAHJKR+kECZ2LgHoKByRSsswZV3UaTqCMFm6LizESraPMBNsVNUtY7OFJdHmGlwaHvMQq0Aw2RTsEZqLIuHj5lxx8FxrVybCEtrTS6YAYcWQbAB1WozYTR1G6B5S2nTRg1TnruDRJ4CceoO8rIBqqD9SncAYC7iGrazruEGY9VpXpKwOzRfMawcxWDBdMAzhteyDllY/bMYaV+5aE0LCFDsNh3EotasYlxtdKNw+obwHcCsVBhnm4JJWqwruMdTY0IlChwLxcwqLyD7iuag0/ghV0UuH0y4YFYp3E4gCxW4wzddH5mbyMxOcGcGYuxY3aE50NVu4bAGSmJSbbYYIuUu6ipcndxsDwQUbQXlrqFgysHJTKa28J2ROELR8VPaAGbuY6BqM5ZZdjgMQUsBAjfCmV0ygShhgNDFIPEQ1LrcwvkFQVTyKwy3sqlepTQ2Gepmd0ZYgUA1tzHqpYouP3nNr/sV1OjbHT4hQBAF/cv64Uvi4OkllFt4IhsNBxczbGaPB7lIlTmXLooXruYsCOUtVHaqXRfPlgCQlaP5ghQfqoNWONrllL3PUfBUCtp3cQrtoG2BdaRZsJVlwiY91Q3fUAgC4tG7ZWty+nEQErF0woboX6xPkhATsOjMvFyrU0kSB1BHDPUsLj3C4hXDUsIzjyl2DYfUpwFjajhV58r5gioNW5WxhcZU0ZipFDp5+pWDPFM/BBiDgxwDMKW73DLaPaLFExi5SSgKeYgsdLy5zEfwvRmyIL6fxBhWZqPiNOcYlRgXx37ml4M+fMCwXrA4lbrOjGWHVTVcZnFaMKIBDDMUYbhEHYZu5cyArOdo91huoyO2PENWPlUrUC45GRCoaUdktVXanhP/JTqE4sE8rn8R8balS8gULhG8MxKze8vNxYcbF49+JUUVbLxK67KkFKEZe5hoOVweiGt2VaVUeIgytZi0NtAzb7lmKMcmjHEKgisrhT+4ruONw6qTZdEGI843LWc3lgeMR9YsYcT21rWYKkPPp3HJ1QVfi4B+RVbeNMbVA4o8zA8jAdxm5c/cZiFyCh2PTKA1c1t8TfEypwwrhXLK9yhlOLYc2R3X7d7hhVqD5XAAomXF+JXhhfYmdPb/csF7afmU/8ASOsws/GCJvV+fMsfuYhCXqcyxFTCqi24lVormVB7XQuiVAK6QqyUq5tvLC4FVwJAaUIyt5gcyrDg8x8tbR/sKYQKCqefXuY3AYB13mIdDYVyRLB3VUVcpwC8dRSIUm+IiMQo9PUAONGH9kYW0TVGYg5X9HqOadL08ShGHZnbLYKYWV+vMYWL5XdeL7jJQoo8vFQGnRq06JkTCNdxqBYKaa4mZUNeUQ5agffEuucWPqCqArxWIpRFWkQQqmIxZ+f+dqdAT95h32wL4f4IRkTJeozSBaIIAFKtRXjdl+cOJYu7NW6R23NHRpgnZTTzUejWldKgBVy+cvMKHnX43h7lhhpAvf75iFd2sbuB60XZmCmiNu59wiuGxbhBxOBdr9dQ4lTkOfIgJBMyGr8TQwUB5b36lyoLw8G5kMJwcG37mWdBgt9IjvzDWiMGSY8MEoM9MErVVa5PPiW6gChyiUEt5bIamXzHfGIBWRV74lwuALgsh1gXcuGXbOYqJ4HzEa5Y9QC5XZ+5vH+QRHzliQWBuAvNxxd6rcw1jSAfcaO0xQ7RP5qXWUrMv244VZRmYrgKrz4l3EEgeC2OYCwtYM1+kIRLmW1xxZKytzllBoCV1qNUM4jhA9n9xOqyBNJ0x2BQOIBvIvLDx8n8TSsdmzzM6ASifJqHOrqryX/UvzhwsZ3tFqKryKqnqHI2j6QuljocTUhZdFpFzCaKNzGDUWoXr3GRtV2rFutTcMuQDYfniLfabp4h88Nyg+v4I3HkYjANAuopt7xCL+q68ypYkSTo9RgNoczKGwWQosUPIlKpKOvqFQwHdRdaOKItL5LhYR8lRV0dsC4EoxzXdfMc8PAuDkSSkHNM4aZvz4lXAVrLi+2CeCKVKcsFi6XHKS8bA8kLbleSJZYDFX13EIVNuEfEOpWpT1vPm/5h5wWwCURj5nuNABamHJDMVu+xUtAgFUcyy0YTmwJn7QrMohiwfNwYrOQxhcK7IXhuLJQwTkIY/IlV3DevEW6S+sJbBC7a/E6T7gK3APzKWOcEZqA6gLDdfiPiI94QltmroSaGAVasHa1ngqLiKxRMQE6CNkcZVjUF6IxtDtw1cABwXRQd/wBQOyLKAzCUWtv/ABLBcfDnLxDWq5Fuxl8ZcFY+4zsg5pggXy8rMy+dYtnJ9R1OPgkapcWCt5HwSs0FoanBTIHLGgXocoFZLEcsDhIOXcIbZQtMPiVgouG48kcuSrzKClrCIKeWPqZFHgENizXTM5atlUOp75l5P/LQdghK9QCkeqdUgvTiJw4thFWDNcxEqo6oNQkK3KxnMM81FKWOqxWPMWNh5e4LQQyrzF5ch3+ZeBccndwbhOXmPWZGvURGHGN+mU5mhguUFJxOKXMPMLiDMzdCVRBlanY5PME2B0yr2UWseooGFPkxAADk6I/ZyUq9iOkgAcnzEM65nDGydWFZDuGnDtTMPKqNVm/cyZXa9sqUYG+oohaHNVcJygvmINgOUnZsggKADDbmeyDpmfiWI+FH0To4ZszLEYl5pCVVhZxHVZNXMSSDwYjAjUjuWNJNWQzjhWVlQNSPt+4CJrdUkO0hyLxKisDggCitI69kB5W5lMIEHN1LPkIusOo51alqvbAUqDg9e4dCKDMblt/Lr3LmGSzgS4Vu3mDawcs5PUc9ClZ3juUGEUPXUp4kDksOZXVXc3LwiclcdwNTA0ZYkKq+kMMl7tcqRzBPH3uZVifIxBgmAfP9oOZ84aTNn6NQeeJzjb3Et0uJRwAYFiyi3JXmISy0qKxRPMVp1gLcrFBnzC6QDj/w2xocnCiviGbu7b7mAu1ZpT6lCVR5blhuNMvAr8EzO0Z2MSv00sc8PUZcgUaoyt+INopi99wDEF2R1MTWZkzqIkwaBy3BE+6ICOX7ljgLw3xzFCXiqcGMQCgWxzPEva0nLjxFyG4ygSoHWBuMTkpFMwsMgVjVOWpdwG101/EZFGvLl4m0wLeD4l14nqg1Lul8DAalkSLin5jFviCDcUpbtTGnjKh09JcQFUMKI+olCIpSvC7jqAG9EvTf2cIRshC9eIBfGHZzLVQE3bMQ3Yw6YksAQ4psi6MKrG3R27hx0TDdW7lvhZStykIlbJSFAWKQyqq683CPQm9XBSeczJ0eagGKDBXUTC1w/wAo66JVnOOpcrWWPEupTWaajOQv3/5BzA0KWp6l0Wc5kUm04QviDmAy0KlBclPzPOfcr5OPZmU46gPuT8yvTJySmQsPuFZYuTzLWG3PEzGHZNQAIlQO4iak+rihAtMr7CHV/UPBgtq0MBGUU1miVsOu3TCZF/8AwmRltNGCKnIC8bi1uvkP6uO9POk7EljbF04l5DlA5x2QzrVB4MRSydFxMQAFpr3BEWhUyhacq/5CtlWzKmqxRnUGtQpNrvEWg3jRFZNqYPZdbz3PTqjMWzLiOISlLdygtjg/4BLA1/U8kbKY7rqLnFrXZuXv0PZCSJg1CXbaIU42MBfA4l8HhWKiJ3LNnxAa6OPMWVt2KpXslp47VzMylLHeI6JxRziJAFsZHnzDC2LRplRLWxWa4RgdzJ7KPoTDCnauSGYSNhphRDZFs88SklFZ8QBWvLpvEzWru+ZaktqzzCSubHB1KmIC0NyoVbY/+RDU79OJd6DZGlWGmGLkRzbmXwDN8wA1gjGVEctR9G/6lwYZbKYO2Fv1r8RN2YxGrCyXxv00DXdERL8NncxFF8Rpi5AsgZFrtC5VHVRWSCzLHw1q5QijXU1ac+6xUK8ylDA+OoeCRsMuoK4JeIFYLULpBrAqBqVrVvlhLawZ4JLq3dg/J4qB5TR4mR0UZLcK7ecGvzO4IA5lxEWhwHmLB4XY3EbUhbRqO5QXTvqUIUlyhIlcRqmwx5iUlGYKhjLt4LlVTYKfblleUoovGIhE8gXslDVVGFfG/GOSdsuNwVO5VnqFaMHUYKrBxCdWwcSl7VMxOfErEYWyl1/Uou8O2H47hIhaEKKSp2IqkC7Dmh5gi6FzLRfCscsdLgHKHthEVFVbSszHYdykN1iDuFd4muYqNlpuoyFtHfUKDKFG1vUNKUpW/wAQi8zQ6RAlztNEtCHyzBjxFiLLiMdLV+CIi27levubGav8yw+VDxKxUAzXDzEFKSzxAeowOmIMFMRHBkrmEOdxdhQoEKcxhSCqvRlu4SqG41JdaaptzHVUJ9Mdhxp44hUhgEcOYgOAWqqKmGTQmvMx0hguB7jsip3MlYTBxlhANMZ/mMAlWQgQC6t6JdWYVIai0YJ38wW3eRslitvNwQVicYB1G1FsHUo5IoDBECBmXUUa5Fjshywp83BKl+YUVYeIYLX5EqFKMjq5gHZxN/jh3DjWMNTOEoIeQjXD5ZTJQ5XPqV6+u/UXC3K3BMlgPVxhpg7EPSKoEieYuDg6WcjGMuUYnXYCG1YMeUJUWCoAE5nNs2RUt6lKciZiIBlHR5jtD5VWOo43uFq2Xu20HMWzt8zBR7ZoixYEvq+gcESq9jq+AiMFTaxVq0F7ep/9dGqb9ZefYgi8g+oHi4nDBYTuO/P/AD5gB0ym9O6+4I+oaQleQ6iNtlRBUXn9ExBV3gOfM099BSxENhSv5lGHBVOIgrg46gF5JfDl9Qde40+5jXCYZZj8pWCRSLZMG2P2BhXVxTJgP9MMmjrDTLTOAY8wPjAuVy/uXkINIsWbwOA2y/Lbxy9sNhnvrzMRfJ28sAOG1h7Cj/2fM/8AjRsRF36vnUXsFIkU1nGTOO5gICxNJ+/tw6B/oeprUHPmYRQMi+B19wUR8iRhXGswEm7IVzbdpTQlaU4jbg2JkA4KiXnIF+yZKmfWot0Xx5gsuWc4iGMYNF/4QuqWhzGoHsVlhgtGKVmOuq2Ic8y2YpGzlAtvCjiKU1tlMKpLlG2q/ictY4ixYyyrHIsR3l+Iq0F3L+J5nXiGjq4/s/yKrF6GCKxhBXv1/b/mIBg56uEsWNV7D0+X8wyJcZJzDFzbsP6gjkpkPmdFWx7JdQf3zLuDI4dOQhdg4QagQ5pjbUhVRHgdQmcLbfMyyybqeIh5iKge5hTzV8OplCHTCdGV8RBTsdwApcSAoRbtgjXksglQbf8AiDz2IbtRxMZnfUfLqaiyot+SOm5cOiXGYkCy9XlmWs8xcvEO2FcQ7r8sykGVsnEi6PTMJl7HkfJMjFPmNq+3aefEyIWh4HsYzGOytV4j/UuGRubCN+OZW2rczCIJ+szEhf2S6xOFyqPFXZajgTN1MNHkYRwDPkJRVKpeW3ASBC/xLEVAnHMYHki1EehqZthTn+mMAmK/Mzc+OoY2CYCLC4AtWPEx/wDal+XBKPnYx7eotdn8SgbyxFQWoCbGDfX7YUqCgl9iUdlg2pLvEbopgFvUlL3gWQdjDrl1AsGhk7hVHPZvM+tks/Nx8xAUVpGxgDJxqFVjBf1Bx/MXz68w7a66m7DX8piUDu42UA7rDFipOyEl5ja4vMX3ewWrwNQSgIAtJviec9HCA7USxTZ17hpxLxFjpgFqxzYNg78xxwTBdRfX56EZKR5igKfvmWdt3uGydm/n4PzB2E2d90wz6lxmjkgyruGUBRkYVkv8j2eIxqEtrD3LLbt0QNOLDRiGXj72dMQFXdM/I0wLKrp/yn8Wx9GGq4j5h+YPWpZpL8TWsdRq1XhmIqdksQpydS5cuXEuJVxABmzRv/i41MH5YqCk329oKopolxCvFfZ5YiBFqs0XhlAMQgI+Lny+I9dfGjo6CJgHBFWWeJ6EVFmSoLETLAmBBSPMS6CyGzslJGdrP+PiDwc+YWBD1CiEcjM0Dx2eeoUC3lOH5JjdHjv87jh1Uh8kOKg3ueJnc9RMbl+K7GfuT6hd+gZcWXFikKv2DDLsPgj9qe4lobqMvojg+JbleWOQLlXcKBVVjFiD0Pivnwj97r/B4mV+hZg2cXGY8qlOpUnn/mGMwX5IBFLFpmCDc7HvoxUzmD4h/epbsjUp8cxWAKN+ZfBWsk+E7GbS36eJ8TecfNkKyuJVShCumfvcDrklZgCneHP1GLdxZfmJGxr8Q2krpzANi9/4mD+pijAfiX1oHgxEUbL7uDxO3/G4LY8Fr0S+U/Jlj52rzFXAhdSvBHnBFq/O9ssPIX2oBXDBluSqh61RWHme0RUiLYNJ6JoN1EsjW4K9mGFNsTXg+I2Tfe3w/wDxOYVZgBluuYSLQSkrkRe0PYWviCKigteaYPaLpv5ogBDmr/MbRvo0wUFjwX+ZTd4uftxACBpGxlNTL+6mmL+IK+IJx+Zn6DtVO1pwb/Mede3LE1RXthKh0Gj3Gfh/BFyc+IxAe8Z8dwDNfJq8dEoaflKNV5YnwzgVOayRB8an7qKx+YXU9VH22yveoCjouG7uHb4gox5hARc/3oXhPZ/Q/pLqXfYpuUCA83qKUBfbiKVpfuNWPEocb3cCi3dqAvyRZynKB9NyjqyPglzC5Aj7zEDOeVp/M12vgfpmJlvN4gW37TKx+ARv+yIQpyql8L16Htlyx0bPtgdmx2xjQ+XBUV083HueZXUTSq9JFVnKBDdvIQC9xmAHI8wle0qRu8Qruo/5d+hBbN+ZmF83FjJHa/iPHuHMxRQ5Z+CHWByYh8wXwGjT0bRSj5cu/Gj+JZIeTf8AssDZVOY2ZNQrnriLNvqBkFRXZg+0QuTxLjY7ZpQ6vUFeYOwZW1K5DAM/C1L6z5LLA/hKyVF3LSMDlglE5DrIFIDQS+yNuOVtjwvDGUdS7kuUOSOYlhhw3DYFD/h//9k=',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    'Spaghetti sautés + Alloco doré croustillant + Piment vert maison + Oignons doux marinés',
    '["dejeuner","diner"]'::jsonb,
    '11h30 - 21h00',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #3: Spaghetti au Merguez,
  (
    'kf-tiep-rouge-capitaine',
    'Tiep Rouge Royal au Capitaine',
    'Riz rouge sénégalais parfumé, tranche de capitaine braisé, carottes glacées, manioc fondant, chou braisé et sauce pimentée maison. Spécialité permanente Khady''s Food.',
    4950,
    'Spécialités Africaines',
    'africain',
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=1000&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    'Plat chaud + Alloco doré croustillant + Piment vert maison + Jus de Bissap frais 33cl',
    '["dejeuner","diner"]'::jsonb,
    '11h30 - 22h00',
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #4: Tiep Rouge Royal au Capitaine,
  (
    'kf-doukounou-royal',
    'Le Fameux Doukounou de Khady',
    'Le célèbre gâteau de maïs vapeur traditionnel au Sahel, cuit à point, tendre et moelleux, servi chaud avec sa sauce mijotée de la maison, piment vert doux et poisson frit ou poulet braisé.',
    2700,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    'Gâteau de maïs vapeur + Sauce mijotée + Poisson frit ou Poulet braisé + Piment vert doux',
    '["dejeuner","diner"]'::jsonb,
    'Tous les jours • 11h30 - 22h00',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #5: Le Fameux Doukounou de Khady,
  (
    'kf-attieke-royal',
    'L''Incontournable Attiéké Royal (Poisson Capitaine)',
    'La semoule de manioc attiéké fraîche et aérée de Cheffe Khady, servie avec darne de poisson capitaine braisée au feu de bois, alloco doré, oignons doux marinés, tomates et piment vert maison.',
    4000,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    'Attiéké fin + Darne de Capitaine braisée + Alloco doré + Oignons marinés + Piment vert maison',
    '["dejeuner","diner"]'::jsonb,
    'Tous les jours • 11h30 - 22h00',
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #6: L'Incontournable Attiéké Royal (Poisson Capitaine),
  (
    'kf-attieke-caviar',
    'Attiéké caviar',
    'Attiéké fin cuit à la perfection avec caviar gourmand et assaisonnements authentiques signés Khady''s Food. Disponible tous les jours de 09 h à 22 h.',
    4000,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Tous les jours, 09 h–22 h',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #7: Attiéké caviar,
  (
    'kf-sauce-gboma-mer',
    'Sauce feuilles d’épinards (Gboma)',
    'Sauce Gboma traditionnelle aux feuilles d''épinards fraîches mijotées, servie avec poisson de mer. Préparée avec soin sur commande.',
    3500,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Sur commande',
    TRUE,
    25,
    NULL,
    '[]'::jsonb,
    '[{"name":"Accompagnement au choix","choices":[{"label":"Riz blanc parfumé","extraPrice":0},{"label":"Pâte de maïs traditionnelle","extraPrice":0},{"label":"Télibo traditionnel","extraPrice":0}]}]'::jsonb
  ) -- #8: Sauce feuilles d’épinards (Gboma),
  (
    'kf-sauce-gboma-fleuve',
    'Sauce Gboma avec carpe ou capitaine',
    'Sauce traditionnelle Gboma aux feuilles d''épinards savoureuses, accompagnée de carpe ou de capitaine frais du fleuve Niger. Préparée sur commande.',
    5000,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Sur commande',
    TRUE,
    25,
    NULL,
    '[]'::jsonb,
    '[{"name":"Poisson au choix","choices":[{"label":"Capitaine frais du fleuve","extraPrice":0},{"label":"Carpe fraîche du fleuve","extraPrice":0}]},{"name":"Accompagnement au choix","choices":[{"label":"Riz blanc parfumé","extraPrice":0},{"label":"Pâte de maïs traditionnelle","extraPrice":0},{"label":"Télibo traditionnel","extraPrice":0}]}]'::jsonb
  ) -- #9: Sauce Gboma avec carpe ou capitaine,
  (
    'kf-spaghetti-sautes',
    'Spaghetti sautés',
    'Spaghetti sautés aux petits légumes et épices du chef, servis chauds au choix avec de savoureuses merguez ou de tendres boulettes de viande. Préparés sur commande.',
    3500,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Sur commande',
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[{"name":"Choix de la garniture","choices":[{"label":"Merguez grillées","extraPrice":0},{"label":"Boulettes de viande maison","extraPrice":0}]}]'::jsonb
  ) -- #10: Spaghetti sautés,
  (
    'kf-sandwich',
    'Sandwich',
    'Sandwich gourmand et croustillant garni de crudités fraîches et sauces au choix, servi avec merguez ou boulettes. Disponible tous les jours.',
    2000,
    'Les Plats Validés Khady''s',
    'entrees',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["petit_dejeuner","dejeuner","diner"]'::jsonb,
    'Tous les jours',
    TRUE,
    10,
    NULL,
    '[]'::jsonb,
    '[{"name":"Choix de viande","choices":[{"label":"Merguez grillées","extraPrice":0},{"label":"Boulettes de viande","extraPrice":0}]}]'::jsonb
  ) -- #11: Sandwich,
  (
    'kf-doukounou-caviar-1',
    'Doukounou caviar — formule 1',
    'Doukounou traditionnel : 4 boules moelleuses accompagnées de sauce caviar et 1 morceau de poisson de mer. Disponible tous les jours.',
    2500,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Tous les jours',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #12: Doukounou caviar — formule 1,
  (
    'kf-doukounou-caviar-2',
    'Doukounou caviar — formule 2',
    'Doukounou traditionnel formule gourmande : 4 boules moelleuses avec sauce caviar et 2 morceaux de poisson de mer. Disponible tous les jours.',
    3500,
    'Les Plats Validés Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    'Tous les jours',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #13: Doukounou caviar — formule 2,
  (
    'kf-pd-1',
    'Petit Déjeuner Sahélien Complet Khady''s',
    'Omelette baveuse aux oignons doux de Galmi et poivrons, beignets Massa de mil chauds au miel du Sahel, baguette croustillante et grand Café Touba épicé.',
    2500,
    '🌅 Petit Déjeuner',
    'petit_dejeuner',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["petit_dejeuner"]'::jsonb,
    '06h30 - 11h00',
    TRUE,
    10,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #14: Petit Déjeuner Sahélien Complet Khady's,
  (
    'kf-pd-2',
    'Bouillie Traditionnelle de Mil Arawak & Lait Caillé Onctueux',
    'Délicieuse bouillie nigérienne de perles de mil cuite aux aromates et cannelle, servie avec du lait caillé frais crémeux et sucre de canne.',
    1500,
    '🌅 Petit Déjeuner',
    'petit_dejeuner',
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=80',
    FALSE,
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["petit_dejeuner"]'::jsonb,
    '06h30 - 11h00',
    TRUE,
    5,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #15: Bouillie Traditionnelle de Mil Arawak & Lait Caillé Onctueux,
  (
    'kf-pd-3',
    'Beignets Massa Dorés au Miel Pur du Niger (Portion de 6)',
    'Petits beignets de farine de mil et riz fermentés cuits à la poêle alvéolée, servis chauds nappés de miel sauvage de forêt.',
    1200,
    '🌅 Petit Déjeuner',
    'petit_dejeuner',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["petit_dejeuner"]'::jsonb,
    '06h30 - 11h00',
    TRUE,
    6,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #16: Beignets Massa Dorés au Miel Pur du Niger (Portion de 6),
  (
    'kf-menu-jour',
    '⭐ Menu du Jour Signature Khady''s (Entrée + Plat + Boisson)',
    'La formule complète du midi : 4 Pastels chauds au poisson du fleuve + Demi-Pintade fermière braisée au Kan-Kan avec Alloco doré + Grand verre de Bissap maison frais 33cl.',
    4500,
    'Menu & Plat du Jour',
    'menu_du_jour',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    '4 Pastels poisson + Demi-Pintade Braisée & Alloco + Jus de Bissap 33cl',
    '["dejeuner","diner"]'::jsonb,
    '11h30 - 22h00',
    TRUE,
    12,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #17: ⭐ Menu du Jour Signature Khady's (Entrée + Plat + Boisson),
  (
    'kf-plat-jour',
    '⭐ Plat du Jour du Chef : Capitaine Braisé & Riz Gras Jollof',
    'Filet de capitaine frais du fleuve Niger grillé aux aromates, servi avec son riz gras sahélien mijoté aux légumes et sauce moyo pimentée.',
    3800,
    'Menu & Plat du Jour',
    'menu_du_jour',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    '11h30 - 22h00',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #18: ⭐ Plat du Jour du Chef : Capitaine Braisé & Riz Gras Jollof,
  (
    'kf-1',
    'Choukouya Royal d''Agneau au Véritable Kan-Kan',
    'Morceaux nobles d''agneau du Sahel cuits à l''étouffée dans du papier kraft avec le mélange d''épices Kan-Kan secret de Khady''s Food, braisés au charbon de bois. Servi avec oignons émincés et piment vert frais.',
    4000,
    'Les Grands Braisés de Khady''s',
    'grillades',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[{"name":"Intensité du Kan-Kan","choices":[{"label":"Assaisonnement Doux & Aromatique","extraPrice":0},{"label":"Kan-Kan Traditionnel Relevé","extraPrice":0},{"label":"Kan-Kan Piquant Sahélien","extraPrice":0}]},{"name":"Garniture au choix","choices":[{"label":"Allocos croustillants dorés (Banane plantain)","extraPrice":500},{"label":"Dambou au moringa fait maison","extraPrice":500},{"label":"Attiéké de qualité supérieure à l''huile rouge","extraPrice":500},{"label":"Frites fraîches croustillantes","extraPrice":500}]}]'::jsonb
  ) -- #19: Choukouya Royal d'Agneau au Véritable Kan-Kan,
  (
    'kf-2',
    'Formule Midi Express Ministères & Fonctionnaires',
    'Plateau repas hermétique conçu pour la pause déjeuner au bureau : Plat au choix (Pintade braisée, Bœuf sauté Dibi ou Poulet fermier) + Riz Jollof parfumé + Jus de Bissap ou Gingembre 33cl. Livré chaud et soigné en 45-55 min par Bilo Express !',
    3200,
    'Formules Midi Bureaux & Ministères',
    'menu_du_jour',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    'Grillade au choix + Riz Jollof parfumé + Jus de Bissap 33cl',
    '["dejeuner"]'::jsonb,
    '11h30 - 15h30',
    TRUE,
    15,
    NULL,
    '[]'::jsonb,
    '[{"name":"Choix de la grillade","choices":[{"label":"Pintade Fermière Braisée Khady''s","extraPrice":0},{"label":"Filet de Bœuf Sauté Dibi aux oignons","extraPrice":0},{"label":"Cuisse de Poulet Dorée au Feu de Bois","extraPrice":0}]},{"name":"Boisson locale fraîche","choices":[{"label":"Jus de Bissap Menthe Maison","extraPrice":0},{"label":"Jus de Gingembre & Ananas","extraPrice":0},{"label":"Jus de Baobab Onctueux","extraPrice":200}]}]'::jsonb
  ) -- #20: Formule Midi Express Ministères & Fonctionnaires,
  (
    'kf-3',
    'Dambou Royal au Poulet Fumé & Feuilles de Moringa',
    'La grande spécialité du Niger : semoule de riz et blé cuite à la vapeur avec des feuilles de moringa (kopto) fraîches, pépites d''arachides torréfiées, morceaux de poulet fermier fumé et sauce tomate mijotée.',
    3500,
    'Spécialités Traditionnelles Khady''s',
    'africain',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    12,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #21: Dambou Royal au Poulet Fumé & Feuilles de Moringa,
  (
    'kf-4',
    'Capitaine Braisé Entier de Khady''s & Sauce Moyo',
    'Gros poisson Capitaine fraîchement pêché du fleuve Niger, mariné aux herbes fraîches et grillé au charbon de bois. Servi avec sauce moyo aux tomates fraîches et piment vert.',
    5000,
    'Les Grands Braisés de Khady''s',
    'grillades',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #22: Capitaine Braisé Entier de Khady's & Sauce Moyo,
  (
    'kf-5',
    'Barquette de Pastels Dorés au Poisson du Fleuve (10 pièces)',
    'Beignets croustillants farcis au poisson du Niger assaisonné aux épices locales, accompagnés de la fameuse sauce pimentée tomate-oignon douce de Khady''s.',
    2000,
    'Entrées & Snacks Partage',
    'entrees',
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    8,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #23: Barquette de Pastels Dorés au Poisson du Fleuve (10 pièces),
  (
    'kf-6',
    'Pack Déjeuner Réunion d''Équipe (Pour 4 à 5 collègues)',
    'Plateau géant pour réunions ministérielles ou de bureau : 1.2kg de Choukouya mixte agneau & pintade, 2 barquettes de Dambou, 2 portions d''allocos dorés et 5 jus locaux au choix.',
    15000,
    'Commandes Groupées Bureaux',
    'grillades',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    20,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #24: Pack Déjeuner Réunion d'Équipe (Pour 4 à 5 collègues),
  (
    'kf-7',
    'Jus Artisanal de Baobab & Tamarin (50cl)',
    'Préparation onctueuse et tonique à base de pulpe de fruit de baobab (pain de singe) du Niger et tamarin acidulé.',
    1000,
    'Boissons Locales Khady''s',
    'boissons',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["petit_dejeuner","dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    2,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #25: Jus Artisanal de Baobab & Tamarin (50cl),
  (
    'kf-8',
    'Pintade Braisée Entière du Sahel & Frites Dorées',
    'Pintade fermière locale du Niger marinée à l''ail, moutarde et épices douces, dorée à la braise incandescentes.',
    5500,
    'Les Grands Braisés de Khady''s',
    'grillades',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    22,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #26: Pintade Braisée Entière du Sahel & Frites Dorées,
  (
    'kf-9',
    'Dégué Traditionnel au Lait Frais de Chamelle & Perles de Mil (Gobelet 400ml)',
    'Dessert sahélien gourmand associant couscous fin de mil à la vapeur, yaourt doux onctueux, muscade et vanille de Madagascar.',
    1500,
    'Desserts & Douceurs',
    'desserts',
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80',
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    1,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    NULL,
    '["dejeuner","diner"]'::jsonb,
    NULL,
    TRUE,
    3,
    NULL,
    '[]'::jsonb,
    '[]'::jsonb
  ) -- #27: Dégué Traditionnel au Lait Frais de Chamelle & Perles de Mil (Gobelet 400ml);

DO $$
DECLARE
  v_target_resto_id text := '99e2e632-4efd-4a44-8754-b806b50babfe';
  v_id_type         text;
  v_resto_id_type   text;
  v_meal_moments_t  text;
  v_cols            text[];
  v_rec             RECORD;
  v_existing_count  integer;
  v_updated_count   integer := 0;
  v_inserted_count  integer := 0;
  v_sql             text;
  v_set_clauses     text[];
  v_ins_cols        text[];
  v_ins_vals        text[];
  v_allergens_t     text;
  v_insert_id       text;
BEGIN
  -- 1. Vérifier que le restaurant cible existe bien dans public.restaurants
  PERFORM 1
  FROM public.restaurants
  WHERE id::text = v_target_resto_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant cible % introuvable dans public.restaurants. Import annulé.', v_target_resto_id;
  END IF;

  -- 2. Inspecter la structure réelle de public.dishes (types et colonnes existantes)
  SELECT data_type INTO v_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'id';

  SELECT data_type INTO v_resto_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'restaurant_id';

  SELECT data_type INTO v_meal_moments_t
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'meal_moments';

  SELECT data_type INTO v_allergens_t
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'allergens';

  SELECT array_agg(column_name::text) INTO v_cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'dishes';

  IF v_cols IS NULL THEN
    RAISE EXCEPTION 'Table public.dishes introuvable.';
  END IF;

  -- 3. Upsert ligne par ligne avec comparaison stricte par nom normalisé
  FOR v_rec IN SELECT * FROM tmp_khadys_dishes LOOP
    SELECT count(*) INTO v_existing_count
    FROM public.dishes d
    WHERE d.restaurant_id::text = v_target_resto_id
      AND lower(regexp_replace(trim(d.name), '\s+', ' ', 'g'))
        = lower(regexp_replace(trim(v_rec.name), '\s+', ' ', 'g'));

    IF v_existing_count > 0 THEN
      -- Mise à jour du ou des plats existants portant déjà ce nom pour ce restaurant
      v_set_clauses := ARRAY[
        'name = $1',
        'description = $2',
        'price = $3',
        'category = $4'
      ];

      IF 'dish_category' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'dish_category = $5'); END IF;
      IF 'image' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'image = $6'); END IF;
      IF 'image_url' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'image_url = $6'); END IF;
      IF 'photo_url' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'photo_url = $6'); END IF;
      IF 'is_popular' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_popular = $7'); END IF;
      IF 'is_vegetarian' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_vegetarian = $8'); END IF;
      IF 'is_vegan' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_vegan = $9'); END IF;
      IF 'is_halal' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_halal = $10'); END IF;
      IF 'is_spicy' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_spicy = $11'); END IF;
      IF 'spice_level' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'spice_level = $12'); END IF;
      IF 'is_gluten_free' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_gluten_free = $13'); END IF;
      IF 'is_niger_local' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_niger_local = $14'); END IF;
      IF 'is_express' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_express = $15'); END IF;
      IF 'is_chef_special' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_chef_special = $16'); END IF;
      IF 'is_healthy' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_healthy = $17'); END IF;
      IF 'is_daily_special' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_daily_special = $18'); END IF;
      IF 'is_menu_du_jour' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_menu_du_jour = $19'); END IF;
      IF 'menu_du_jour_includes' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'menu_du_jour_includes = $20'); END IF;
      IF 'meal_moments' = ANY(v_cols) THEN
        IF v_meal_moments_t = 'ARRAY' THEN
          v_set_clauses := array_append(v_set_clauses, 'meal_moments = ARRAY(SELECT jsonb_array_elements_text($21))');
        ELSE
          v_set_clauses := array_append(v_set_clauses, 'meal_moments = $21');
        END IF;
      END IF;
      IF 'meal_service_time' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'meal_service_time = $22'); END IF;
      IF 'is_available' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'is_available = $23'); END IF;
      IF 'preparation_time' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'preparation_time = $24'); END IF;
      IF 'calories' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'calories = $25'); END IF;
      IF 'allergens' = ANY(v_cols) THEN
        IF v_allergens_t = 'ARRAY' THEN
          v_set_clauses := array_append(v_set_clauses, 'allergens = ARRAY(SELECT jsonb_array_elements_text($26))');
        ELSE
          v_set_clauses := array_append(v_set_clauses, 'allergens = $26');
        END IF;
      END IF;
      IF 'options' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'options = $27'); END IF;
      IF 'updated_at' = ANY(v_cols) THEN v_set_clauses := array_append(v_set_clauses, 'updated_at = NOW()'); END IF;

      v_sql := format(
        'UPDATE public.dishes SET %s WHERE restaurant_id::text = $28 AND lower(regexp_replace(trim(name), ''\s+'', '' '', ''g'')) = lower(regexp_replace(trim($1), ''\s+'', '' '', ''g''))',
        array_to_string(v_set_clauses, ', ')
      );

      EXECUTE v_sql USING
        v_rec.name, v_rec.description, v_rec.price, v_rec.category, v_rec.dish_category,
        v_rec.image, v_rec.is_popular, v_rec.is_vegetarian, v_rec.is_vegan, v_rec.is_halal,
        v_rec.is_spicy, v_rec.spice_level, v_rec.is_gluten_free, v_rec.is_niger_local,
        v_rec.is_express, v_rec.is_chef_special, v_rec.is_healthy, v_rec.is_daily_special,
        v_rec.is_menu_du_jour, v_rec.menu_du_jour_includes, v_rec.meal_moments,
        v_rec.meal_service_time, v_rec.is_available, v_rec.preparation_time, v_rec.calories,
        v_rec.allergens, v_rec.options, v_target_resto_id;

      v_updated_count := v_updated_count + 1;
    ELSE
      -- Éviter toute collision de clé primaire si v_rec.source_id existe déjà sous un autre restaurant_id
      v_insert_id := v_rec.source_id;
      IF v_id_type <> 'uuid' THEN
        PERFORM 1 FROM public.dishes WHERE id::text = v_insert_id;
        IF FOUND THEN
          v_insert_id := v_rec.source_id || '-' || substr(md5(v_target_resto_id || ':' || v_rec.name), 1, 8);
        END IF;
      END IF;

      -- Insertion uniquement si aucun plat du même nom n'existe déjà pour ce restaurant
      v_ins_cols := ARRAY['id', 'restaurant_id', 'name', 'description', 'price', 'category'];
      v_ins_vals := ARRAY[
        CASE WHEN v_id_type = 'uuid' THEN 'gen_random_uuid()' ELSE '$29' END,
        CASE WHEN v_resto_id_type = 'uuid' THEN '$28::uuid' ELSE '$28' END,
        '$1', '$2', '$3', '$4'
      ];

      IF 'dish_category' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'dish_category'); v_ins_vals := array_append(v_ins_vals, '$5'); END IF;
      IF 'image' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'image'); v_ins_vals := array_append(v_ins_vals, '$6'); END IF;
      IF 'image_url' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'image_url'); v_ins_vals := array_append(v_ins_vals, '$6'); END IF;
      IF 'photo_url' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'photo_url'); v_ins_vals := array_append(v_ins_vals, '$6'); END IF;
      IF 'is_popular' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_popular'); v_ins_vals := array_append(v_ins_vals, '$7'); END IF;
      IF 'is_vegetarian' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_vegetarian'); v_ins_vals := array_append(v_ins_vals, '$8'); END IF;
      IF 'is_vegan' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_vegan'); v_ins_vals := array_append(v_ins_vals, '$9'); END IF;
      IF 'is_halal' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_halal'); v_ins_vals := array_append(v_ins_vals, '$10'); END IF;
      IF 'is_spicy' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_spicy'); v_ins_vals := array_append(v_ins_vals, '$11'); END IF;
      IF 'spice_level' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'spice_level'); v_ins_vals := array_append(v_ins_vals, '$12'); END IF;
      IF 'is_gluten_free' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_gluten_free'); v_ins_vals := array_append(v_ins_vals, '$13'); END IF;
      IF 'is_niger_local' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_niger_local'); v_ins_vals := array_append(v_ins_vals, '$14'); END IF;
      IF 'is_express' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_express'); v_ins_vals := array_append(v_ins_vals, '$15'); END IF;
      IF 'is_chef_special' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_chef_special'); v_ins_vals := array_append(v_ins_vals, '$16'); END IF;
      IF 'is_healthy' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_healthy'); v_ins_vals := array_append(v_ins_vals, '$17'); END IF;
      IF 'is_daily_special' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_daily_special'); v_ins_vals := array_append(v_ins_vals, '$18'); END IF;
      IF 'is_menu_du_jour' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_menu_du_jour'); v_ins_vals := array_append(v_ins_vals, '$19'); END IF;
      IF 'menu_du_jour_includes' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'menu_du_jour_includes'); v_ins_vals := array_append(v_ins_vals, '$20'); END IF;
      IF 'meal_moments' = ANY(v_cols) THEN
        v_ins_cols := array_append(v_ins_cols, 'meal_moments');
        IF v_meal_moments_t = 'ARRAY' THEN
          v_ins_vals := array_append(v_ins_vals, 'ARRAY(SELECT jsonb_array_elements_text($21))');
        ELSE
          v_ins_vals := array_append(v_ins_vals, '$21');
        END IF;
      END IF;
      IF 'meal_service_time' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'meal_service_time'); v_ins_vals := array_append(v_ins_vals, '$22'); END IF;
      IF 'is_available' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'is_available'); v_ins_vals := array_append(v_ins_vals, '$23'); END IF;
      IF 'preparation_time' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'preparation_time'); v_ins_vals := array_append(v_ins_vals, '$24'); END IF;
      IF 'calories' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'calories'); v_ins_vals := array_append(v_ins_vals, '$25'); END IF;
      IF 'allergens' = ANY(v_cols) THEN
        v_ins_cols := array_append(v_ins_cols, 'allergens');
        IF v_allergens_t = 'ARRAY' THEN
          v_ins_vals := array_append(v_ins_vals, 'ARRAY(SELECT jsonb_array_elements_text($26))');
        ELSE
          v_ins_vals := array_append(v_ins_vals, '$26');
        END IF;
      END IF;
      IF 'options' = ANY(v_cols) THEN v_ins_cols := array_append(v_ins_cols, 'options'); v_ins_vals := array_append(v_ins_vals, '$27'); END IF;

      v_sql := format(
        'INSERT INTO public.dishes (%s) VALUES (%s)',
        array_to_string(v_ins_cols, ', '),
        array_to_string(v_ins_vals, ', ')
      );

      EXECUTE v_sql USING
        v_rec.name, v_rec.description, v_rec.price, v_rec.category, v_rec.dish_category,
        v_rec.image, v_rec.is_popular, v_rec.is_vegetarian, v_rec.is_vegan, v_rec.is_halal,
        v_rec.is_spicy, v_rec.spice_level, v_rec.is_gluten_free, v_rec.is_niger_local,
        v_rec.is_express, v_rec.is_chef_special, v_rec.is_healthy, v_rec.is_daily_special,
        v_rec.is_menu_du_jour, v_rec.menu_du_jour_includes, v_rec.meal_moments,
        v_rec.meal_service_time, v_rec.is_available, v_rec.preparation_time, v_rec.calories,
        v_rec.allergens, v_rec.options, v_target_resto_id, v_insert_id;

      v_inserted_count := v_inserted_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Import Khady''s Food terminé : % plat(s) mis à jour, % plat(s) inséré(s).', v_updated_count, v_inserted_count;
END $$;

COMMIT;
