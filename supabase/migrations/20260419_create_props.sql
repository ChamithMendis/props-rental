-- Props inventory table
create table if not exists public.props (
  id            text primary key,
  name          text not null,
  category      text,
  description   text,
  price_per_day integer not null default 0,
  price_per_hour integer not null default 0,
  quantity      integer not null default 1,
  available     boolean not null default true,
  published     boolean not null default true,
  tags          text[] not null default '{}',
  images        text[] not null default '{}',
  dimensions    text,
  weight        text,
  color         text,
  created_at    date not null default current_date,
  updated_at    date not null default current_date
);

-- Enable Row Level Security
alter table public.props enable row level security;

-- Public read: only published props
create policy "Public can read published props"
  on public.props for select
  using (published = true);

-- Seed data from props.json
insert into public.props
  (id, name, category, description, price_per_day, price_per_hour, quantity, available, published, tags, images, dimensions, weight, color, created_at, updated_at)
values
  (
    'prop_001', 'Antique Chesterfield Sofa', 'Furniture',
    'A stunning mid-century Chesterfield sofa in deep burgundy velvet. Perfect for period dramas, luxury brand shoots, or editorial photography. Well-maintained with no visible wear.',
    4500, 800, 2, true, true,
    array['vintage','velvet','luxury','seating'],
    array['https://lh3.googleusercontent.com/d/SAMPLE_ID_1','https://lh3.googleusercontent.com/d/SAMPLE_ID_2'],
    '220cm W × 90cm D × 85cm H', '45kg', 'Burgundy', '2024-04-01', '2024-04-18'
  ),
  (
    'prop_002', 'Industrial Edison Pendant Light', 'Lighting',
    'A set of 3 Edison bulb pendant lights on an aged-copper fixture. Creates warm, moody atmosphere. Suitable for restaurant scenes, product shoots, and film sets.',
    2000, 400, 5, true, true,
    array['industrial','warm','ambiance','set-of-3'],
    array['https://lh3.googleusercontent.com/d/SAMPLE_ID_3'],
    'Each globe: 15cm dia, cord: 120cm', '3kg per set', 'Copper / Amber', '2024-04-02', '2024-04-18'
  ),
  (
    'prop_003', 'Vintage Brass Telephone', 'Vintage',
    'Fully restored 1940s rotary dial telephone in polished brass. Works as a display prop. Ideal for period pieces, vintage-themed shoots, and nostalgic settings.',
    1500, 300, 3, true, true,
    array['1940s','brass','telephone','period'],
    array['https://lh3.googleusercontent.com/d/SAMPLE_ID_4'],
    '28cm W × 22cm D × 18cm H', '2kg', 'Brass', '2024-04-03', '2024-04-18'
  ),
  (
    'prop_004', 'Persian Silk Rug (6×4ft)', 'Textiles',
    'Hand-woven Persian silk rug in rich jewel tones — deep teal, crimson and gold. Adds instant elegance to any set. Clean and in excellent condition.',
    3500, 700, 1, false, true,
    array['persian','rug','silk','floor','luxury'],
    array['https://lh3.googleusercontent.com/d/SAMPLE_ID_5'],
    '182cm × 122cm', '8kg', 'Teal / Crimson / Gold', '2024-04-05', '2024-04-18'
  ),
  (
    'prop_005', 'Reclaimed Wood Dining Table', 'Furniture',
    'Rustic reclaimed teak dining table with natural grain and character marks. Seats 6 comfortably. Great for food photography, lifestyle shoots, and rustic interiors.',
    5500, 1000, 1, true, true,
    array['rustic','teak','dining','reclaimed'],
    array['https://lh3.googleusercontent.com/d/SAMPLE_ID_6'],
    '180cm W × 90cm D × 75cm H', '65kg', 'Natural Teak', '2024-04-06', '2024-04-18'
  )
on conflict (id) do nothing;
