alter table public.events
  add column if not exists poster_url text,
  add column if not exists duration text,
  add column if not exists training_fee text,
  add column if not exists certificate text,
  add column if not exists learning_topics text[] not null default '{}';

update public.events
set
  poster_url = coalesce(nullif(trim(poster_url), ''), '/assets/sap-validation-approach.jpeg'),
  duration = coalesce(nullif(trim(duration), ''), '2 Hours'),
  training_fee = coalesce(nullif(trim(training_fee), ''), '₹2,000/-'),
  certificate = coalesce(nullif(trim(certificate), ''), 'Participation'),
  learning_topics = case
    when coalesce(cardinality(learning_topics), 0) = 0 then array[
      'SAP in GxP Environments',
      'SAP Validation Lifecycle',
      'SAP FI/CO, MM, SD, QM and PP',
      'LIMS and MES Integration',
      'Risk Assessment and Impact Analysis',
      'Data Integrity and Change Control',
      'Testing and Documentation',
      '21 CFR Part 11, EU Annex 11 and GAMP 5'
    ]::text[]
    else learning_topics
  end
where poster_url is null
   or trim(poster_url) = ''
   or duration is null
   or trim(duration) = ''
   or training_fee is null
   or trim(training_fee) = ''
   or certificate is null
   or trim(certificate) = ''
   or coalesce(cardinality(learning_topics), 0) = 0;
