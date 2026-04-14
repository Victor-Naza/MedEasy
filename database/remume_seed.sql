-- ============================================================
-- REMUME 2025-2026 – Seed Data
-- Prefeitura Municipal de Fortaleza – 4ª Edição
--
-- ATENÇÃO: Execute em tabelas vazias ou rode o TRUNCATE abaixo.
-- Os id_categoria (1-21) são gerados sequencialmente pelo SERIAL.
-- ============================================================

-- Limpa tabelas e reinicia as sequences
TRUNCATE TABLE medicamentos, categorias RESTART IDENTITY CASCADE;

-- ============================================================
-- CATEGORIAS (ATC)
-- ============================================================
INSERT INTO categorias (nome, icone, cor) VALUES
  ('Aparelho Digestivo e Metabolismo',           'stomach',       '#4CAF50'),  -- 1
  ('Sangue e Órgãos Hematopoiéticos',            'droplet',       '#F44336'),  -- 2
  ('Aparelho Cardiovascular',                    'heart',         '#E91E63'),  -- 3
  ('Medicamentos Dermatológicos',                'bandage',       '#FF9800'),  -- 4
  ('Aparelho Geniturinário e Hormônios Sexuais', 'dna',           '#9C27B0'),  -- 5
  ('Preparações Hormonais Sistêmicas',           'activity',      '#FFC107'),  -- 6
  ('Antibacterianos',                            'shield',        '#2196F3'),  -- 7
  ('Antifúngicos',                               'zap',           '#00BCD4'),  -- 8
  ('Antituberculosos',                           'wind',          '#795548'),  -- 9
  ('Antihanseníase',                             'shield-check',  '#607D8B'),  -- 10
  ('Antivirais',                                 'cpu',           '#FF5722'),  -- 11
  ('Soros e Imunoglobulinas',                    'shield-plus',   '#8BC34A'),  -- 12
  ('Vacinas',                                    'syringe',       '#CDDC39'),  -- 13
  ('Antineoplásicos e Imunomoduladores',         'atom',          '#673AB7'),  -- 14
  ('Sistema Músculo Esquelético',                'layout',        '#FF6F00'),  -- 15
  ('Sistema Nervoso',                            'brain',         '#3F51B5'),  -- 16
  ('Antiparasitários',                           'bug',           '#009688'),  -- 17
  ('Aparelho Respiratório',                      'wind',          '#03A9F4'),  -- 18
  ('Órgãos Sensitivos',                          'eye',           '#76FF03'),  -- 19
  ('Vários e Insumos',                           'box',           '#9E9E9E'),  -- 20
  ('Fitoterápicos',                              'leaf',          '#66BB6A');  -- 21

-- ============================================================
-- MEDICAMENTOS
-- Colunas: nome, principio_ativo, via_administracao,
--          concentracao, apresentacao, id_categoria
-- ============================================================

-- ── A – Aparelho Digestivo e Metabolismo (1) ─────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Ácido ursodesoxicólico',                              'Ácido ursodesoxicólico',                              'Oral',       '300 mg',                                                                          'Comprimido',                                          1),
  ('Alogliptina, benzoato',                               'Alogliptina',                                         'Oral',       '25 mg',                                                                           'Comprimido',                                          1),
  ('Calcitriol',                                          'Calcitriol',                                          'Oral',       '0,25 mcg',                                                                        'Cápsula mole',                                        1),
  ('Carbonato de cálcio',                                 'Carbonato de cálcio',                                 'Oral',       '1.250 mg (500 mg de cálcio)',                                                     'Cápsula',                                             1),
  ('Carbonato de cálcio + Colecalciferol (Vitamina D)',   'Carbonato de cálcio + Colecalciferol',                'Oral',       '600 mg + 400 UI',                                                                 'Comprimido',                                          1),
  ('Dapagliflozina',                                      'Dapagliflozina',                                      'Oral',       '10 mg',                                                                           'Comprimido',                                          1),
  ('Domperidona',                                         'Domperidona',                                         'Oral',       '1 mg/ml',                                                                         'Suspensão oral (frasco 100 ml)',                       1),
  ('Domperidona',                                         'Domperidona',                                         'Oral',       '10 mg',                                                                           'Comprimido',                                          1),
  ('Glibenclamida',                                       'Glibenclamida',                                       'Oral',       '5 mg',                                                                            'Comprimido',                                          1),
  ('Gliclazida',                                          'Gliclazida',                                          'Oral',       '60 mg',                                                                           'Comprimido',                                          1),
  ('Insulina análoga de ação prolongada',                 'Insulina análoga de ação prolongada',                 'Parenteral', '100 UI/ml',                                                                       'Solução injetável com sistema de aplicação',          1),
  ('Insulina análoga de ação rápida',                     'Insulina análoga de ação rápida',                     'Parenteral', '100 UI/ml',                                                                       'Solução injetável com sistema de aplicação',          1),
  ('Insulina humana NPH',                                 'Insulina humana NPH',                                 'Parenteral', '100 UI/ml',                                                                       'Suspensão injetável',                                 1),
  ('Insulina humana regular',                             'Insulina humana regular',                             'Parenteral', '100 UI/ml',                                                                       'Suspensão injetável',                                 1),
  ('Loperamida, cloridrato',                              'Loperamida',                                          'Oral',       '2 mg',                                                                            'Comprimido',                                          1),
  ('Mesalazina',                                          'Mesalazina',                                          'Oral',       '400 mg',                                                                          'Comprimido',                                          1),
  ('Mesalazina',                                          'Mesalazina',                                          'Oral',       '500 mg',                                                                          'Comprimido de liberação prolongada',                  1),
  ('Mesalazina',                                          'Mesalazina',                                          'Oral',       '800 mg',                                                                          'Comprimido',                                          1),
  ('Metformina, cloridrato',                              'Metformina',                                          'Oral',       '500 mg',                                                                          'Comprimido',                                          1),
  ('Metoclopramida',                                      'Metoclopramida',                                      'Oral',       '10 mg',                                                                           'Comprimido',                                          1),
  ('Nistatina',                                           'Nistatina',                                           'Oral',       '100.000 UI/ml',                                                                   'Suspensão oral',                                      1),
  ('Pancreatina',                                         'Pancreatina',                                         'Oral',       '10.000 UI',                                                                       'Cápsula',                                             1),
  ('Pancreatina',                                         'Pancreatina',                                         'Oral',       '25.000 UI',                                                                       'Cápsula',                                             1),
  ('Retinol, palmitato',                                  'Retinol',                                             'Oral',       '100.000 UI',                                                                      'Cápsula mole',                                        1),
  ('Retinol, palmitato',                                  'Retinol',                                             'Oral',       '200.000 UI',                                                                      'Cápsula mole',                                        1),
  ('Sais para reidratação oral',                          'Cloreto de sódio + Glicose + Cloreto de potássio + Citrato de sódio', 'Oral', 'Cloreto de sódio, glicose anidra, cloreto de potássio, citrato de sódio diidratado', 'Pó para solução oral', 1),
  ('Omeprazol',                                           'Omeprazol',                                           'Oral',       '20 mg',                                                                           'Cápsula',                                             1),
  ('Ondansetrona, cloridrato',                            'Ondansetrona',                                        'Oral',       '4 mg',                                                                            'Comprimido dispersível',                              1),
  ('Sulfassalazina',                                      'Sulfassalazina',                                      'Oral',       '500 mg',                                                                          'Comprimido',                                          1),
  ('Trientina',                                           'Trientina',                                           'Oral',       '250 mg',                                                                          'Cápsula',                                             1),
  ('Vitamina B6 (Cloridrato de piridoxina)',               'Piridoxina',                                          'Oral',       '40 mg',                                                                           'Comprimido',                                          1),
  ('Vitamina B6 (Cloridrato de piridoxina)',               'Piridoxina',                                          'Oral',       '50 mg',                                                                           'Comprimido',                                          1);

-- ── B – Sangue e Órgãos Hematopoiéticos (2) ──────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Ácido acetilsalicílico',     'Ácido acetilsalicílico',  'Oral',       '100 mg',           'Comprimido',                                           2),
  ('Ácido fólico',               'Ácido fólico',            'Oral',       '0,2 mg/ml',        'Solução oral',                                         2),
  ('Alfaepoetina',               'Alfaepoetina',            'Parenteral', '1.000 UI',         'Solução injetável ou pó para solução injetável',       2),
  ('Alfaepoetina',               'Alfaepoetina',            'Parenteral', '2.000 UI',         'Solução injetável ou pó para solução injetável',       2),
  ('Alfaepoetina',               'Alfaepoetina',            'Parenteral', '3.000 UI',         'Solução injetável ou pó para solução injetável',       2),
  ('Alfaepoetina',               'Alfaepoetina',            'Parenteral', '4.000 UI',         'Solução injetável ou pó para solução injetável',       2),
  ('Alfaepoetina',               'Alfaepoetina',            'Parenteral', '10.000 UI',        'Solução injetável ou pó para solução injetável',       2),
  ('Cloreto de sódio',           'Cloreto de sódio',        'Parenteral', '0,9% (0,154 mEq/mL)', 'Solução injetável',                               2),
  ('Cloreto de sódio 0,9%',      'Cloreto de sódio',        'Parenteral', '0,9%',             'Frasco',                                               2),
  ('Clopidogrel',                'Clopidogrel',             'Oral',       '75 mg',            'Comprimido',                                           2),
  ('Eltrombopague olamina',      'Eltrombopague',           'Oral',       '25 mg',            'Comprimido',                                           2),
  ('Eltrombopague olamina',      'Eltrombopague',           'Oral',       '50 mg',            'Comprimido',                                           2),
  ('Enoxaparina sódica',         'Enoxaparina',             'Parenteral', '40 mg/0,4 ml',     'Solução injetável',                                    2),
  ('Enoxaparina sódica',         'Enoxaparina',             'Parenteral', '60 mg/0,6 ml',     'Solução injetável',                                    2),
  ('Hidróxido férrico, sacarato','Hidróxido férrico',       'Parenteral', '100 mg/5 ml',      'Solução injetável',                                    2),
  ('Sulfato ferroso',            'Sulfato ferroso',         'Oral',       '40 mg (ferro elementar)', 'Comprimido',                                    2),
  ('Sulfato ferroso',            'Sulfato ferroso',         'Oral',       '25 mg/mL (ferro elementar)', 'Solução oral',                               2),
  ('Varfarina sódica',           'Varfarina',               'Oral',       '5 mg',             'Comprimido',                                           2);

-- ── C – Aparelho Cardiovascular (3) ──────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Amiodarona, cloridrato',                  'Amiodarona',                'Oral', '200 mg',  'Comprimido', 3),
  ('Anlodipino, besilato',                    'Anlodipino',                'Oral', '5 mg',    'Comprimido', 3),
  ('Atenolol',                                'Atenolol',                  'Oral', '50 mg',   'Comprimido', 3),
  ('Atorvastatina cálcica',                   'Atorvastatina',             'Oral', '10 mg',   'Comprimido', 3),
  ('Atorvastatina cálcica',                   'Atorvastatina',             'Oral', '20 mg',   'Comprimido', 3),
  ('Atorvastatina cálcica',                   'Atorvastatina',             'Oral', '40 mg',   'Comprimido', 3),
  ('Carvedilol',                              'Carvedilol',                'Oral', '25 mg',   'Comprimido', 3),
  ('Carvedilol',                              'Carvedilol',                'Oral', '6,25 mg', 'Comprimido', 3),
  ('Ciprofibrato',                            'Ciprofibrato',              'Oral', '100 mg',  'Comprimido', 3),
  ('Doxazosina, mesilato',                    'Doxazosina',                'Oral', '2 mg',    'Comprimido', 3),
  ('Enalapril, maleato',                      'Enalapril',                 'Oral', '10 mg',   'Comprimido', 3),
  ('Enalapril, maleato',                      'Enalapril',                 'Oral', '20 mg',   'Comprimido', 3),
  ('Espironolactona',                         'Espironolactona',           'Oral', '25 mg',   'Comprimido', 3),
  ('Furosemida',                              'Furosemida',                'Oral', '40 mg',   'Comprimido', 3),
  ('Hidroclorotiazida',                       'Hidroclorotiazida',         'Oral', '25 mg',   'Comprimido', 3),
  ('Isossorbida, mononitrato',                'Isossorbida mononitrato',   'Oral', '40 mg',   'Comprimido', 3),
  ('Losartana potássica',                     'Losartana',                 'Oral', '50 mg',   'Comprimido', 3),
  ('Metildopa',                               'Metildopa',                 'Oral', '250 mg',  'Comprimido', 3),
  ('Propranolol, cloridrato',                 'Propranolol',               'Oral', '40 mg',   'Comprimido', 3),
  ('Sacubitril valsartana sódica hidratada',  'Sacubitril + Valsartana',   'Oral', '50 mg',   'Comprimido', 3),
  ('Sacubitril valsartana sódica hidratada',  'Sacubitril + Valsartana',   'Oral', '100 mg',  'Comprimido', 3),
  ('Sacubitril valsartana sódica hidratada',  'Sacubitril + Valsartana',   'Oral', '200 mg',  'Comprimido', 3),
  ('Sinvastatina',                            'Sinvastatina',              'Oral', '20 mg',   'Comprimido', 3);

-- ── D – Medicamentos Dermatológicos (4) ──────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Acitretina',                                     'Acitretina',         'Oral',    '10 mg',            'Cápsula',               4),
  ('Acitretina',                                     'Acitretina',         'Oral',    '25 mg',            'Cápsula',               4),
  ('Ácidos Graxos Essenciais com vitamina A e E (AGE)', 'AGE',             'Tópica',  NULL,               'Loção',                 4),
  ('Calcipotriol',                                   'Calcipotriol',       'Tópica',  '50 mcg/g (0,0005%)', 'Pomada',              4),
  ('Clobetasol, propionato',                         'Clobetasol',         'Tópica',  '0,5 mg/g',         'Creme dermatológico',   4),
  ('Dexametasona',                                   'Dexametasona',       'Tópica',  '1 mg/g (0,1%)',    'Creme dermatológico',   4),
  ('Isotretinoína',                                  'Isotretinoína',      'Oral',    '20 mg',            'Cápsula mole',          4),
  ('Lidocaína, cloridrato',                          'Lidocaína',          'Tópica',  '20 mg/g (2%)',     'Gel',                   4),
  ('Miconazol, nitrato',                             'Miconazol',          'Tópica',  '20 mg/g (2%)',     'Creme dermatológico',   4),
  ('Óleo mineral',                                   'Óleo mineral',       'Tópica',  '20 mg/g',          'Creme dermatológico',   4),
  ('Sulfadiazina de prata',                          'Sulfadiazina de prata', 'Tópica', '10 mg/g (1%)',  'Creme dermatológico',   4);

-- ── G – Aparelho Geniturinário e Hormônios Sexuais (5) ───────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Algestona acetofenida + Estradiol, enantato',         'Algestona + Estradiol',         'Parenteral',    '150 mg/ml + 10 mg/ml',         'Solução injetável',        5),
  ('Cabergolina',                                         'Cabergolina',                   'Oral',          '0,5 mg',                       'Comprimido',               5),
  ('Ciproterona, acetato',                                'Ciproterona',                   'Oral',          '50 mg',                        'Comprimido',               5),
  ('Dispositivo Intrauterino (DIU) plástico em cobre',   'DIU cobre',                     'Intrauterino',  NULL,                           'Modelo T 380 mm²',         5),
  ('Finasterida',                                         'Finasterida',                   'Oral',          '5 mg',                         'Comprimido',               5),
  ('Fosfomicina Trometamol',                              'Fosfomicina',                   'Oral',          '3 g',                          'Pó para solução oral',     5),
  ('Gosserrelina',                                        'Gosserrelina',                  'Parenteral',    '3,6 mg',                       'Solução injetável',        5),
  ('Gosserrelina',                                        'Gosserrelina',                  'Parenteral',    '10,8 mg',                      'Solução injetável',        5),
  ('Levonorgestrel',                                      'Levonorgestrel',                'Oral',          '0,75 mg',                      'Comprimido',               5),
  ('Levonorgestrel + Etinilestradiol',                    'Levonorgestrel + Etinilestradiol', 'Oral',       '0,15 mg + 0,03 mg',            'Comprimido',               5),
  ('Medroxiprogesterona, acetato',                        'Medroxiprogesterona',           'Parenteral',    '150 mg/ml',                    'Suspensão injetável',      5),
  ('Medroxiprogesterona, acetato + Estradiol, cipionato', 'Medroxiprogesterona + Estradiol', 'Parenteral',  '25 mg/0,5 ml + 5 mg/0,5 ml',  'Suspensão injetável',      5),
  ('Metronidazol',                                        'Metronidazol',                  'Vaginal',       '100 mg (10%)',                 'Geleia vaginal',           5),
  ('Miconazol, nitrato',                                  'Miconazol',                     'Vaginal',       '20 mg/g (2%)',                 'Creme vaginal',            5),
  ('Noretisterona',                                       'Noretisterona',                 'Oral',          '0,35 mg',                      'Comprimido',               5),
  ('Noretisterona, enantato + Estradiol, valerato',       'Noretisterona + Estradiol',     'Parenteral',    '50 mg/ml + 5 mg/ml',           'Solução injetável',        5),
  ('Oxibutinina',                                         'Oxibutinina',                   'Oral',          '1 mg/mL',                      'Xarope',                   5),
  ('Oxibutinina',                                         'Oxibutinina',                   'Oral',          '5 mg',                         'Comprimido',               5),
  ('Raloxifeno, cloridrato',                              'Raloxifeno',                    'Oral',          '60 mg',                        'Comprimido',               5);

-- ── H – Preparações Hormonais Sistêmicas (6) ─────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Cinacalcete, cloridrato',       'Cinacalcete',     'Oral',       '30 mg',       'Comprimido',                                          6),
  ('Cinacalcete, cloridrato',       'Cinacalcete',     'Oral',       '60 mg',       'Comprimido',                                          6),
  ('Desmopressina',                 'Desmopressina',   'Nasal',      '0,1 mg/ml',   'Solução nasal',                                       6),
  ('Levotiroxina',                  'Levotiroxina',    'Oral',       '25 mcg',      'Comprimido',                                          6),
  ('Levotiroxina',                  'Levotiroxina',    'Oral',       '100 mcg',     'Comprimido',                                          6),
  ('Paricalcitol',                  'Paricalcitol',    'Parenteral', '5 mcg/ml',    'Solução injetável',                                   6),
  ('Prednisolona, fosfato sódico',  'Prednisolona',    'Oral',       '3 mg/mL',     'Solução oral',                                        6),
  ('Prednisona',                    'Prednisona',      'Oral',       '5 mg',        'Comprimido',                                          6),
  ('Prednisona',                    'Prednisona',      'Oral',       '20 mg',       'Comprimido',                                          6),
  ('Propiltiouracila',              'Propiltiouracila','Oral',       '100 mg',      'Comprimido',                                          6),
  ('Somatropina',                   'Somatropina',     'Parenteral', '4 UI',        'Solução injetável ou pó para solução injetável',      6),
  ('Somatropina',                   'Somatropina',     'Parenteral', '12 UI',       'Solução injetável ou pó para solução injetável',      6);

-- ── J01 – Antibacterianos (7) ────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Amoxicilina',                              'Amoxicilina',                  'Oral',       '50 mg/ml',                  'Suspensão oral',                        7),
  ('Amoxicilina',                              'Amoxicilina',                  'Oral',       '500 mg',                    'Cápsula',                               7),
  ('Amoxicilina + clavulanato de potássio',    'Amoxicilina + Clavulanato',    'Oral',       '500 mg + 125 mg',           'Comprimido',                            7),
  ('Amoxicilina + clavulanato de potássio',    'Amoxicilina + Clavulanato',    'Oral',       '50 mg + 12,5 mg/ml',        'Suspensão oral',                        7),
  ('Azitromicina',                             'Azitromicina',                 'Oral',       '500 mg',                    'Comprimido',                            7),
  ('Azitromicina',                             'Azitromicina',                 'Oral',       '40 mg/ml',                  'Pó para suspensão oral',                7),
  ('Benzilpenicilina benzatina',               'Benzilpenicilina benzatina',   'Parenteral', '1.200.000 UI',              'Pó para suspensão injetável',           7),
  ('Cefalexina',                               'Cefalexina',                   'Oral',       '500 mg',                    'Cápsula',                               7),
  ('Cefalexina',                               'Cefalexina',                   'Oral',       '50 mg/mL',                  'Suspensão oral',                        7),
  ('Ceftriaxona',                              'Ceftriaxona',                  'Parenteral', '500 mg',                    'Pó para solução injetável',             7),
  ('Ciprofloxacino',                           'Ciprofloxacino',               'Oral',       '500 mg',                    'Comprimido',                            7),
  ('Claritromicina',                           'Claritromicina',               'Oral',       '500 mg',                    'Comprimido',                            7),
  ('Clindamicina, cloridrato',                 'Clindamicina',                 'Oral',       '300 mg',                    'Cápsula',                               7),
  ('Doxiciclina, cloridrato',                  'Doxiciclina',                  'Oral',       '100 mg',                    'Cápsula',                               7),
  ('Espiramicina',                             'Espiramicina',                 'Oral',       '1.500.000 UI (500 mg)',      'Comprimido',                            7),
  ('Estreptomicina, sulfato',                  'Estreptomicina',               'Parenteral', '1 g',                       'Pó para solução injetável (frasco ampola)', 7),
  ('Levofloxacino',                            'Levofloxacino',                'Oral',       '500 mg',                    'Comprimido',                            7),
  ('Metronidazol',                             'Metronidazol',                 'Oral',       '500 mg',                    'Comprimido',                            7),
  ('Nitrofurantoína',                          'Nitrofurantoína',              'Oral',       '100 mg',                    'Cápsula',                               7),
  ('Ofloxacino',                               'Ofloxacino',                   'Oral',       '400 mg',                    'Comprimido',                            7),
  ('Sulfametoxazol + trimetoprima',            'Sulfametoxazol + Trimetoprima','Oral',       '40 mg/mL + 8 mg/mL',        'Suspensão oral',                        7),
  ('Sulfametoxazol + trimetoprima',            'Sulfametoxazol + Trimetoprima','Oral',       '400 mg + 80 mg',            'Comprimido',                            7),
  ('Sulfadiazina',                             'Sulfadiazina',                 'Oral',       '500 mg',                    'Comprimido',                            7);

-- ── J02 – Antifúngicos (8) ───────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Fluconazol',   'Fluconazol',   'Oral', '150 mg', 'Cápsula', 8),
  ('Itraconazol',  'Itraconazol',  'Oral', '100 mg', 'Cápsula', 8);

-- ── J04A – Antituberculosos (9) ──────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Etambutol, cloridrato',                                            'Etambutol',                                              'Oral', '400 mg',                           'Comprimido',              9),
  ('Isoniazida',                                                       'Isoniazida',                                             'Oral', '100 mg',                           'Comprimido',              9),
  ('Isoniazida',                                                       'Isoniazida',                                             'Oral', '300 mg',                           'Comprimido',              9),
  ('Pirazinamida',                                                     'Pirazinamida',                                           'Oral', '500 mg',                           'Comprimido',              9),
  ('Pirazinamida',                                                     'Pirazinamida',                                           'Oral', '150 mg',                           'Comprimido dispersível',  9),
  ('Rifapentina',                                                      'Rifapentina',                                            'Oral', '150 mg',                           'Comprimido',              9),
  ('Rifapentina + Isoniazida',                                         'Rifapentina + Isoniazida',                               'Oral', '300 mg + 300 mg',                  'Comprimido',              9),
  ('Rifampicina + Isoniazida + Pirazinamida + Etambutol',             'Rifampicina + Isoniazida + Pirazinamida + Etambutol',    'Oral', '150 mg + 75 mg + 400 mg + 275 mg', 'Comprimido',              9),
  ('Rifampicina',                                                      'Rifampicina',                                            'Oral', '20 mg/mL',                         'Suspensão oral',          9),
  ('Rifampicina',                                                      'Rifampicina',                                            'Oral', '300 mg',                           'Cápsula',                 9),
  ('Rifampicina + Isoniazida',                                         'Rifampicina + Isoniazida',                               'Oral', '300 mg + 150 mg',                  'Comprimido',              9),
  ('Rifampicina + Isoniazida',                                         'Rifampicina + Isoniazida',                               'Oral', '150 mg + 75 mg',                   'Comprimido',              9),
  ('Rifampicina + Isoniazida',                                         'Rifampicina + Isoniazida',                               'Oral', '75 mg + 50 mg',                    'Comprimido dispersível',  9),
  ('Rifampicina + Isoniazida + Pirazinamida',                          'Rifampicina + Isoniazida + Pirazinamida',                'Oral', '75 mg + 50 mg + 150 mg',           'Comprimido dispersível',  9);

-- ── J04B – Antihanseníase (10) ───────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Clofazimina', 'Clofazimina', 'Oral', '100 mg', 'Cápsula', 10),
  ('Clofazimina', 'Clofazimina', 'Oral', '50 mg',  'Cápsula', 10),
  ('Dapsona',     'Dapsona',     'Oral', '50 mg',  'Comprimido', 10),
  ('Dapsona',     'Dapsona',     'Oral', '100 mg', 'Comprimido', 10),
  ('Rifampicina', 'Rifampicina', 'Oral', '150 mg', 'Cápsula', 10),
  ('Rifampicina', 'Rifampicina', 'Oral', '300 mg', 'Cápsula', 10);

-- ── J05 – Antivirais (11) ────────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Abacavir, sulfato',                                        'Abacavir',                             'Oral',       '300 mg',                              'Comprimido',                              11),
  ('Abacavir, sulfato',                                        'Abacavir',                             'Oral',       '20 mg/mL',                            'Solução oral',                            11),
  ('Aciclovir',                                                'Aciclovir',                            'Oral',       '200 mg',                              'Comprimido',                              11),
  ('Atazanavir, sulfato',                                      'Atazanavir',                           'Oral',       '300 mg',                              'Cápsula',                                 11),
  ('Darunavir',                                                'Darunavir',                            'Oral',       '75 mg',                               'Comprimido',                              11),
  ('Darunavir',                                                'Darunavir',                            'Oral',       '150 mg',                              'Comprimido',                              11),
  ('Darunavir',                                                'Darunavir',                            'Oral',       '600 mg',                              'Comprimido',                              11),
  ('Darunavir',                                                'Darunavir',                            'Oral',       '800 mg',                              'Comprimido',                              11),
  ('Dolutegravir sódico',                                      'Dolutegravir',                         'Oral',       '5 mg',                                'Comprimido',                              11),
  ('Dolutegravir sódico',                                      'Dolutegravir',                         'Oral',       '50 mg',                               'Comprimido',                              11),
  ('Dolutegravir sódico + Lamivudina',                         'Dolutegravir + Lamivudina',            'Oral',       '50 mg + 300 mg',                      'Comprimido',                              11),
  ('Efavirenz',                                                'Efavirenz',                            'Oral',       '200 mg',                              'Cápsula',                                 11),
  ('Efavirenz',                                                'Efavirenz',                            'Oral',       '600 mg',                              'Comprimido',                              11),
  ('Efavirenz',                                                'Efavirenz',                            'Oral',       '30 mg/mL',                            'Solução oral',                            11),
  ('Enfuvirtida',                                              'Enfuvirtida',                          'Parenteral', '108 mg (90 mg/ml após reconstituição)','Pó para solução injetável (frasco ampola)', 11),
  ('Entecavir',                                                'Entecavir',                            'Oral',       '0,5 mg',                              'Comprimido',                              11),
  ('Etravirina',                                               'Etravirina',                           'Oral',       '100 mg',                              'Comprimido',                              11),
  ('Etravirina',                                               'Etravirina',                           'Oral',       '200 mg',                              'Comprimido',                              11),
  ('Glecaprevir + Pibrentasvir',                               'Glecaprevir + Pibrentasvir',           'Oral',       '100 mg + 40 mg',                      'Comprimido',                              11),
  ('Lamivudina',                                               'Lamivudina',                           'Oral',       '150 mg',                              'Comprimido',                              11),
  ('Lamivudina',                                               'Lamivudina',                           'Oral',       '10 mg/mL',                            'Solução oral (frasco de 240 ml)',          11),
  ('Ledipasvir + Sofosbuvir',                                  'Ledipasvir + Sofosbuvir',              'Oral',       '90 mg + 400 mg',                      'Comprimido',                              11),
  ('Lopinavir + Ritonavir',                                    'Lopinavir + Ritonavir',                'Oral',       '80 mg/ml + 20 mg/ml',                 'Solução oral',                            11),
  ('Maraviroque',                                              'Maraviroque',                          'Oral',       '150 mg',                              'Comprimido',                              11),
  ('Nevirapina',                                               'Nevirapina',                           'Oral',       '200 mg',                              'Comprimido',                              11),
  ('Nevirapina',                                               'Nevirapina',                           'Oral',       '10 mg/mL',                            'Solução oral',                            11),
  ('Nirmatrelvir + Ritonavir',                                 'Nirmatrelvir + Ritonavir',             'Oral',       '150 mg + 100 mg',                     'Comprimido',                              11),
  ('Oseltamivir, fosfato',                                     'Oseltamivir',                          'Oral',       '30 mg',                               'Cápsula',                                 11),
  ('Oseltamivir, fosfato',                                     'Oseltamivir',                          'Oral',       '45 mg',                               'Cápsula',                                 11),
  ('Oseltamivir, fosfato',                                     'Oseltamivir',                          'Oral',       '75 mg',                               'Cápsula',                                 11),
  ('Raltegravir potássico',                                    'Raltegravir',                          'Oral',       '100 mg',                              'Granulado para solução oral',             11),
  ('Ritonavir',                                                'Ritonavir',                            'Oral',       '100 mg',                              'Comprimido',                              11),
  ('Sofosbuvir',                                               'Sofosbuvir',                           'Oral',       '400 mg',                              'Comprimido',                              11),
  ('Sofosbuvir + Velpatasvir',                                 'Sofosbuvir + Velpatasvir',             'Oral',       '400 mg + 100 mg',                     'Comprimido',                              11),
  ('Tenofovir desoproxila, fumarato',                          'Tenofovir',                            'Oral',       '300 mg',                              'Comprimido',                              11),
  ('Tenofovir desoproxila, fumarato + Entricitabina',          'Tenofovir + Entricitabina',            'Oral',       '300 mg + 200 mg',                     'Comprimido',                              11),
  ('Tenofovir desoproxila, fumarato + Lamivudina',             'Tenofovir + Lamivudina',               'Oral',       '300 mg + 300 mg',                     'Comprimido',                              11),
  ('Tenofovir desoproxila, fumarato + Lamivudina + Efavirenz', 'Tenofovir + Lamivudina + Efavirenz',  'Oral',       '300 mg + 300 mg + 600 mg',            'Comprimido',                              11),
  ('Tenofovir, hemifumarato alafenamida',                      'Tenofovir alafenamida',                'Oral',       '25 mg',                               'Comprimido/Cápsula',                      11),
  ('Tipranavir',                                               'Tipranavir',                           'Oral',       '250 mg',                              'Cápsula mole',                            11),
  ('Tipranavir',                                               'Tipranavir',                           'Oral',       '100 mg/ml',                           'Solução oral',                            11),
  ('Zidovudina',                                               'Zidovudina',                           'Oral',       '100 mg',                              'Cápsula',                                 11),
  ('Zidovudina',                                               'Zidovudina',                           'Oral',       '10 mg/mL',                            'Solução oral',                            11),
  ('Zidovudina',                                               'Zidovudina',                           'Parenteral', '10 mg/mL',                            'Solução injetável',                       11),
  ('Zidovudina + Lamivudina',                                  'Zidovudina + Lamivudina',              'Oral',       '300 mg + 150 mg',                     'Comprimido',                              11);

-- ── J06 – Soros e Imunoglobulinas (12) ──────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Palivizumabe', 'Palivizumabe', 'Parenteral', '50 mg/ml',  'Solução injetável', 12),
  ('Palivizumabe', 'Palivizumabe', 'Parenteral', '100 mg/ml', 'Solução injetável', 12);

-- ── J07 – Vacinas (13) ───────────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Vacina adsorvida difteria e tétano adulto',                                                     'Toxoide diftérico + Toxoide tetânico',                             'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida difteria, tétano e pertussis',                                                 'Toxoide diftérico + Toxoide tetânico + B. pertussis',             'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida difteria, tétano e pertussis (acelular) adulto',                               'DTPa adulto',                                                     'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida difteria, tétano e pertussis (acelular) infantil',                             'DTPa infantil',                                                   'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida difteria, tétano, pertussis, hepatite B e Haemophilus influenzae B',           'DTPwHB-Hib (Penta)',                                              'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida hepatite A (inativada) adulto',                                                'Vírus hepatite A inativado (adulto)',                              'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina adsorvida hepatite A (inativada) infantil',                                              'Vírus hepatite A inativado (infantil)',                            'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina BCG',                                                                                    'Mycobacterium bovis (BCG)',                                        'Parenteral', NULL, 'Pó para suspensão injetável',  13),
  ('Vacina contra raiva animal',                                                                    'Vírus rábico inativado (animal)',                                  'Parenteral', NULL, 'Solução injetável',            13),
  ('Vacina contra raiva humana',                                                                    'Vírus rábico inativado (humana)',                                  'Parenteral', NULL, 'Solução injetável',            13),
  ('Vacina dupla viral',                                                                            'Sarampo + Rubéola',                                               'Parenteral', NULL, 'Solução injetável',            13),
  ('Vacina febre amarela (atenuada)',                                                               'Vírus febre amarela atenuado',                                    'Parenteral', NULL, 'Pó para solução injetável',    13),
  ('Vacina Gripe (Influenza)',                                                                      'Vírus influenza inativado',                                       'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina Haemophilus influenzae B (conjugada)',                                                   'Haemophilus influenzae B conjugado',                              'Parenteral', NULL, 'Pó para solução injetável',    13),
  ('Vacina hepatite B (recombinante)',                                                              'HBsAg recombinante',                                              'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina meningocócica ACWY (conjugada)',                                                         'Neisseria meningitidis ACWY conjugada',                           'Parenteral', NULL, 'Solução injetável',            13),
  ('Vacina meningocócica C (conjugada)',                                                            'Neisseria meningitidis C conjugada',                              'Parenteral', NULL, 'Pó para suspensão injetável',  13),
  ('Vacina papilomavírus humano 6, 11, 16 e 18 (recombinante)',                                    'HPV 6, 11, 16, 18 recombinante',                                  'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina pneumocócica 10-valente (conjugada)',                                                    'S. pneumoniae 10 sorotipos conjugada',                            'Parenteral', NULL, 'Suspensão injetável',          13),
  ('Vacina poliomielite 1 e 3 (atenuada)',                                                         'Poliovírus 1 e 3 atenuados (VOP)',                                'Oral',       NULL, 'Solução oral',                 13),
  ('Vacina poliomielite 1, 2 e 3 (inativada)',                                                     'Poliovírus 1, 2 e 3 inativados (VIP)',                            'Parenteral', NULL, 'Solução injetável',            13),
  ('Vacina rotavírus humano G1P[8] (atenuada)',                                                    'Rotavírus G1P[8] atenuado',                                       'Oral',       NULL, 'Suspensão oral',               13),
  ('Vacina sarampo, caxumba, rubéola (Tríplice viral)',                                            'Sarampo + Caxumba + Rubéola',                                     'Parenteral', NULL, 'Pó para solução injetável',    13),
  ('Vacina varicela (atenuada)',                                                                    'Vírus varicela-zóster atenuado',                                  'Parenteral', NULL, 'Pó para solução injetável',    13);

-- ── L – Antineoplásicos e Imunomoduladores (14) ──────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Adalimumabe',              'Adalimumabe',             'Parenteral', '40 mg/ml',       'Solução injetável',              14),
  ('Azatioprina',              'Azatioprina',             'Oral',       '50 mg',          'Comprimido',                     14),
  ('Baricitinibe',             'Baricitinibe',            'Oral',       '2 mg',           'Comprimido',                     14),
  ('Baricitinibe',             'Baricitinibe',            'Oral',       '4 mg',           'Comprimido',                     14),
  ('Certolizumabe pegol',      'Certolizumabe pegol',     'Parenteral', '200 mg/ml',      'Solução injetável',              14),
  ('Ciclosporina',             'Ciclosporina',            'Oral',       '50 mg',          'Cápsula mole',                   14),
  ('Ciclosporina',             'Ciclosporina',            'Oral',       '100 mg',         'Cápsula mole',                   14),
  ('Ciclosporina',             'Ciclosporina',            'Parenteral', '100 mg/ml',      'Solução injetável',              14),
  ('Ciclofosfamida',           'Ciclofosfamida',          'Oral',       '50 mg',          'Comprimido',                     14),
  ('Etanercept',               'Etanercept',              'Parenteral', '50 mg',          'Pó para solução injetável',      14),
  ('Fumarato de dimetila',     'Fumarato de dimetila',    'Oral',       '240 mg',         'Cápsula',                        14),
  ('Golimumabe',               'Golimumabe',              'Parenteral', '50 mg/0,5 ml',   'Solução injetável',              14),
  ('Gosserrelina',             'Gosserrelina',            'Parenteral', '3,6 mg',         'Solução injetável',              14),
  ('Gosserrelina',             'Gosserrelina',            'Parenteral', '10,8 mg',        'Solução injetável',              14),
  ('Infliximabe',              'Infliximabe',             'Parenteral', '10 mg/ml',       'Pó para suspensão injetável',    14),
  ('Leflunomida',              'Leflunomida',             'Oral',       '20 mg',          'Comprimido',                     14),
  ('Leuprorrelina, acetato',   'Leuprorrelina',           'Parenteral', '3,75 mg',        'Pó para suspensão injetável',    14),
  ('Leuprorrelina, acetato',   'Leuprorrelina',           'Parenteral', '11,25 mg',       'Pó para suspensão injetável',    14),
  ('Leuprorrelina, acetato',   'Leuprorrelina',           'Parenteral', '45 mg',          'Pó para suspensão injetável',    14),
  ('Metotrexato',              'Metotrexato',             'Oral',       '2,5 mg',         'Comprimido',                     14),
  ('Metotrexato',              'Metotrexato',             'Parenteral', '25 mg/ml',       'Pó para suspensão injetável',    14),
  ('Micofenolato de mofetila', 'Micofenolato de mofetila','Oral',      '500 mg',         'Comprimido',                     14),
  ('Micofenolato de sódio',    'Micofenolato de sódio',   'Oral',      '360 mg',         'Comprimido',                     14),
  ('Natalizumabe',             'Natalizumabe',            'Parenteral', '300 mg/15 ml',   'Solução injetável',              14),
  ('Risanquizumabe',           'Risanquizumabe',          'Parenteral', '90 mg/ml',       'Solução injetável',              14),
  ('Rituximabe',               'Rituximabe',              'Parenteral', '500 mg/50 ml',   'Solução injetável',              14),
  ('Secuquinumabe',            'Secuquinumabe',           'Parenteral', '150 mg/ml',      'Pó para solução injetável',      14),
  ('Sirolimo',                 'Sirolimo',                'Oral',       '1 mg',           'Drágea',                         14),
  ('Tacrolimo',                'Tacrolimo',               'Oral',       '1 mg',           'Cápsula',                        14),
  ('Tacrolimo',                'Tacrolimo',               'Oral',       '5 mg',           'Cápsula',                        14),
  ('Talidomida',               'Talidomida',              'Oral',       '100 mg',         'Comprimido',                     14),
  ('Tofacitinibe',             'Tofacitinibe',            'Oral',       '5 mg',           'Comprimido',                     14),
  ('Triptorrelina',            'Triptorrelina',           'Parenteral', '3,75 mg',        'Pó para suspensão injetável',    14),
  ('Triptorrelina',            'Triptorrelina',           'Parenteral', '11,25 mg',       'Pó para suspensão injetável',    14),
  ('Triptorrelina',            'Triptorrelina',           'Parenteral', '22,5 mg',        'Pó para suspensão injetável',    14),
  ('Upadacitinibe',            'Upadacitinibe',           'Oral',       '15 mg',          'Comprimido revestido de liberação prolongada', 14),
  ('Ustequinumabe',            'Ustequinumabe',           'Parenteral', '45 mg/0,5 ml',   'Solução injetável',              14),
  ('Vedolizumabe',             'Vedolizumabe',            'Parenteral', '300 mg',         'Pó para solução injetável',      14);

-- ── M – Sistema Músculo Esquelético (15) ─────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Ácido zoledrônico',      'Ácido zoledrônico',    'Parenteral', '0,05 mg/ml', 'Solução injetável',        15),
  ('Alendronato de sódio',   'Alendronato',          'Oral',       '70 mg',      'Comprimido',               15),
  ('Baclofeno',              'Baclofeno',            'Oral',       '10 mg',      'Comprimido',               15),
  ('Ibuprofeno',             'Ibuprofeno',           'Oral',       '600 mg',     'Comprimido',               15),
  ('Ibuprofeno',             'Ibuprofeno',           'Oral',       '50 mg/ml',   'Suspensão oral',           15),
  ('Risedronato sódico',     'Risedronato',          'Oral',       '35 mg',      'Comprimido',               15),
  ('Romosozumabe',           'Romosozumabe',         'Parenteral', '90 mg/ml',   'Solução injetável',        15),
  ('Toxina botulínica A',    'Toxina botulínica A',  'Parenteral', '100 UI',     'Pó para solução injetável',15);

-- ── N – Sistema Nervoso (16) ─────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Ácido valpróico (valproato de sódio)',   'Ácido valpróico',          'Oral',       '50 mg/ml',    'Solução oral',                        16),
  ('Ácido valpróico (valproato de sódio)',   'Ácido valpróico',          'Oral',       '500 mg',      'Comprimido',                          16),
  ('Alprazolam',                             'Alprazolam',               'Oral',       '0,5 mg',      'Comprimido',                          16),
  ('Alprazolam',                             'Alprazolam',               'Oral',       '2 mg',        'Comprimido',                          16),
  ('Amantadina, cloridrato',                 'Amantadina',               'Oral',       '100 mg',      'Comprimido',                          16),
  ('Amitriptilina, cloridrato',              'Amitriptilina',            'Oral',       '25 mg',       'Comprimido',                          16),
  ('Biperideno, cloridrato',                 'Biperideno',               'Oral',       '2 mg',        'Comprimido',                          16),
  ('Bupropiona, cloridrato',                 'Bupropiona',               'Oral',       '150 mg',      'Comprimido de liberação prolongada',  16),
  ('Carbamazepina',                          'Carbamazepina',            'Oral',       '20 mg/ml',    'Suspensão oral',                      16),
  ('Carbamazepina',                          'Carbamazepina',            'Oral',       '200 mg',      'Comprimido',                          16),
  ('Carbonato de lítio',                     'Lítio',                    'Oral',       '300 mg',      'Comprimido',                          16),
  ('Citalopram',                             'Citalopram',               'Oral',       '20 mg',       'Comprimido',                          16),
  ('Clobazam',                               'Clobazam',                 'Oral',       '10 mg',       'Comprimido',                          16),
  ('Clobazam',                               'Clobazam',                 'Oral',       '20 mg',       'Comprimido',                          16),
  ('Clonazepam',                             'Clonazepam',               'Oral',       '2 mg',        'Comprimido',                          16),
  ('Clonazepam',                             'Clonazepam',               'Oral',       '2,5 mg/mL',   'Solução oral',                        16),
  ('Clomipramina, cloridrato',               'Clomipramina',             'Oral',       '25 mg',       'Comprimido',                          16),
  ('Clorpromazina, cloridrato',              'Clorpromazina',            'Oral',       '25 mg',       'Comprimido',                          16),
  ('Clorpromazina, cloridrato',              'Clorpromazina',            'Oral',       '100 mg',      'Comprimido',                          16),
  ('Clorpromazina, cloridrato',              'Clorpromazina',            'Oral',       '40 mg/ml',    'Solução oral',                        16),
  ('Clozapina',                              'Clozapina',                'Oral',       '25 mg',       'Comprimido',                          16),
  ('Clozapina',                              'Clozapina',                'Oral',       '100 mg',      'Comprimido',                          16),
  ('Codeína',                                'Codeína',                  'Oral',       '30 mg',       'Comprimido',                          16),
  ('Diazepam',                               'Diazepam',                 'Oral',       '10 mg',       'Comprimido',                          16),
  ('Dipirona',                               'Dipirona',                 'Parenteral', '500 mg/mL',   'Solução injetável',                   16),
  ('Dipirona',                               'Dipirona',                 'Oral',       '500 mg/mL',   'Solução oral',                        16),
  ('Dipirona',                               'Dipirona',                 'Oral',       '500 mg',      'Comprimido',                          16),
  ('Donepezila, cloridrato',                 'Donepezila',               'Oral',       '5 mg',        'Comprimido',                          16),
  ('Donepezila, cloridrato',                 'Donepezila',               'Oral',       '10 mg',       'Comprimido',                          16),
  ('Entacapona',                             'Entacapona',               'Oral',       '200 mg',      'Comprimido',                          16),
  ('Etossuximida',                           'Etossuximida',             'Oral',       '50 mg/ml',    'Xarope',                              16),
  ('Fenitoína',                              'Fenitoína',                'Oral',       '100 mg',      'Comprimido',                          16),
  ('Fenobarbital',                           'Fenobarbital',             'Oral',       '100 mg',      'Comprimido',                          16),
  ('Fenobarbital',                           'Fenobarbital',             'Oral',       '40 mg/ml',    'Solução oral',                        16),
  ('Fluoxetina, cloridrato',                 'Fluoxetina',               'Oral',       '20 mg',       'Cápsula',                             16),
  ('Gabapentina',                            'Gabapentina',              'Oral',       '400 mg',      'Cápsula',                             16),
  ('Galantamina, bromidrato',                'Galantamina',              'Oral',       '8 mg',        'Cápsula de liberação prolongada',     16),
  ('Galantamina, bromidrato',                'Galantamina',              'Oral',       '16 mg',       'Cápsula de liberação prolongada',     16),
  ('Galantamina, bromidrato',                'Galantamina',              'Oral',       '24 mg',       'Cápsula de liberação prolongada',     16),
  ('Haloperidol',                            'Haloperidol',              'Oral',       '5 mg',        'Comprimido',                          16),
  ('Haloperidol',                            'Haloperidol',              'Oral',       '2 mg/ml',     'Solução oral',                        16),
  ('Haloperidol, decanoato',                 'Haloperidol decanoato',    'Parenteral', '50 mg/ml',    'Solução injetável',                   16),
  ('Hidroxizina, cloridrato',                'Hidroxizina',              'Oral',       '10 mg/5 ml',  'Suspensão oral',                      16),
  ('Hidroxizina, cloridrato',                'Hidroxizina',              'Oral',       '25 mg',       'Comprimido',                          16),
  ('Lamotrigina',                            'Lamotrigina',              'Oral',       '25 mg',       'Comprimido',                          16),
  ('Lamotrigina',                            'Lamotrigina',              'Oral',       '50 mg',       'Comprimido',                          16),
  ('Lamotrigina',                            'Lamotrigina',              'Oral',       '100 mg',      'Comprimido',                          16),
  ('Levetiracetam',                          'Levetiracetam',            'Oral',       '250 mg',      'Comprimido',                          16),
  ('Levetiracetam',                          'Levetiracetam',            'Oral',       '500 mg',      'Comprimido',                          16),
  ('Levetiracetam',                          'Levetiracetam',            'Oral',       '750 mg',      'Comprimido',                          16),
  ('Levetiracetam',                          'Levetiracetam',            'Oral',       '1000 mg',     'Comprimido',                          16),
  ('Levetiracetam',                          'Levetiracetam',            'Oral',       '100 mg/mL',   'Solução oral',                        16),
  ('Levodopa + Benserazida',                 'Levodopa + Benserazida',   'Oral',       '100 mg + 25 mg','Cápsula',                           16),
  ('Levodopa + Benserazida',                 'Levodopa + Benserazida',   'Oral',       '100 mg + 25 mg','Comprimido birranhurado',            16),
  ('Levodopa + Benserazida',                 'Levodopa + Benserazida',   'Oral',       '200 mg + 50 mg','Comprimido',                        16),
  ('Levomepromazina',                        'Levomepromazina',          'Oral',       '25 mg',       'Comprimido',                          16),
  ('Levomepromazina',                        'Levomepromazina',          'Oral',       '100 mg',      'Comprimido',                          16),
  ('Memantina',                              'Memantina',                'Oral',       '10 mg',       'Comprimido',                          16),
  ('Metilfenidato, cloridrato',              'Metilfenidato',            'Oral',       '10 mg',       'Comprimido',                          16),
  ('Morfina',                                'Morfina',                  'Oral',       '10 mg',       'Comprimido',                          16),
  ('Morfina',                                'Morfina',                  'Oral',       '30 mg',       'Comprimido',                          16),
  ('Nicotina',                               'Nicotina',                 'Transdérmica','7 mg',       'Adesivo transdérmico',                16),
  ('Nicotina',                               'Nicotina',                 'Transdérmica','14 mg',      'Adesivo transdérmico',                16),
  ('Nicotina',                               'Nicotina',                 'Transdérmica','21 mg',      'Adesivo transdérmico',                16),
  ('Nicotina',                               'Nicotina',                 'Oral',       '2 mg',        'Goma de mascar',                      16),
  ('Nicotina',                               'Nicotina',                 'Oral',       '2 mg',        'Pastilha',                            16),
  ('Nortriptilina, cloridrato',              'Nortriptilina',            'Oral',       '25 mg',       'Cápsula',                             16),
  ('Olanzapina',                             'Olanzapina',               'Oral',       '5 mg',        'Comprimido',                          16),
  ('Olanzapina',                             'Olanzapina',               'Oral',       '10 mg',       'Comprimido',                          16),
  ('Oxcarbazepina',                          'Oxcarbazepina',            'Oral',       '300 mg',      'Comprimido',                          16),
  ('Oxcarbazepina',                          'Oxcarbazepina',            'Oral',       '60 mg/ml',    'Suspensão oral',                      16),
  ('Paracetamol',                            'Paracetamol',              'Oral',       '200 mg/mL',   'Solução oral',                        16),
  ('Paracetamol',                            'Paracetamol',              'Oral',       '500 mg',      'Comprimido',                          16),
  ('Paroxetina',                             'Paroxetina',               'Oral',       '20 mg',       'Comprimido',                          16),
  ('Piridostigmina, brometo',                'Piridostigmina',           'Oral',       '60 mg',       'Comprimido',                          16),
  ('Pramipexol, dicloridrato',               'Pramipexol',               'Oral',       '0,125 mg',    'Comprimido',                          16),
  ('Pramipexol, dicloridrato',               'Pramipexol',               'Oral',       '0,25 mg',     'Comprimido',                          16),
  ('Pramipexol, dicloridrato',               'Pramipexol',               'Oral',       '1 mg',        'Comprimido',                          16),
  ('Pregabalina',                            'Pregabalina',              'Oral',       '75 mg',       'Comprimido',                          16),
  ('Pregabalina',                            'Pregabalina',              'Oral',       '150 mg',      'Comprimido',                          16),
  ('Quetiapina, hemifumarato',               'Quetiapina',               'Oral',       '25 mg',       'Comprimido',                          16),
  ('Quetiapina, hemifumarato',               'Quetiapina',               'Oral',       '100 mg',      'Comprimido',                          16),
  ('Quetiapina, hemifumarato',               'Quetiapina',               'Oral',       '200 mg',      'Comprimido',                          16),
  ('Quetiapina, hemifumarato',               'Quetiapina',               'Oral',       '300 mg',      'Comprimido',                          16),
  ('Rasagilina, mesilato',                   'Rasagilina',               'Oral',       '1 mg',        'Comprimido',                          16),
  ('Riluzol',                                'Riluzol',                  'Oral',       '50 mg',       'Comprimido',                          16),
  ('Risperidona',                            'Risperidona',              'Oral',       '1 mg/ml',     'Solução oral (frasco com 30 ml)',      16),
  ('Risperidona',                            'Risperidona',              'Oral',       '1 mg',        'Comprimido',                          16),
  ('Risperidona',                            'Risperidona',              'Oral',       '2 mg',        'Comprimido',                          16),
  ('Risperidona',                            'Risperidona',              'Oral',       '3 mg',        'Comprimido',                          16),
  ('Rivastigmina',                           'Rivastigmina',             'Oral',       '1,5 mg',      'Cápsula',                             16),
  ('Rivastigmina',                           'Rivastigmina',             'Oral',       '3 mg',        'Cápsula',                             16),
  ('Rivastigmina',                           'Rivastigmina',             'Oral',       '4,5 mg',      'Cápsula',                             16),
  ('Rivastigmina',                           'Rivastigmina',             'Oral',       '6 mg',        'Cápsula',                             16),
  ('Rivastigmina',                           'Rivastigmina',             'Transdérmica','9 mg',       'Adesivo transdérmico',                16),
  ('Rivastigmina',                           'Rivastigmina',             'Transdérmica','18 mg',      'Adesivo transdérmico',                16),
  ('Sertralina, cloridrato',                 'Sertralina',               'Oral',       '50 mg',       'Comprimido',                          16),
  ('Tafamidis',                              'Tafamidis',                'Oral',       '20 mg',       'Cápsula',                             16),
  ('Topiramato',                             'Topiramato',               'Oral',       '25 mg',       'Comprimido',                          16),
  ('Topiramato',                             'Topiramato',               'Oral',       '50 mg',       'Comprimido',                          16),
  ('Topiramato',                             'Topiramato',               'Oral',       '100 mg',      'Comprimido',                          16),
  ('Venlafaxina',                            'Venlafaxina',              'Oral',       '75 mg',       'Cápsula de ação prolongada',          16),
  ('Vigabatrina',                            'Vigabatrina',              'Oral',       '500 mg',      'Comprimido',                          16),
  ('Ziprasidona, cloridrato',                'Ziprasidona',              'Oral',       '40 mg',       'Cápsula',                             16),
  ('Ziprasidona, cloridrato',                'Ziprasidona',              'Oral',       '80 mg',       'Cápsula',                             16);

-- ── P – Antiparasitários (17) ────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Albendazol',                  'Albendazol',                   'Oral',   '40 mg/ml',        'Suspensão oral',        17),
  ('Albendazol',                  'Albendazol',                   'Oral',   '400 mg',           'Comprimido mastigável', 17),
  ('Cloroquina, difosfato',       'Cloroquina',                   'Oral',   '150 mg',           'Comprimido',            17),
  ('Hidroxicloroquina, sulfato',  'Hidroxicloroquina',            'Oral',   '400 mg',           'Comprimido',            17),
  ('Ivermectina',                 'Ivermectina',                  'Oral',   '6 mg',             'Comprimido',            17),
  ('Permetrina',                  'Permetrina',                   'Tópica', '50 mg/g (5%)',     'Loção',                 17),
  ('Permetrina',                  'Permetrina',                   'Tópica', '10 mg/g (1%)',     'Loção',                 17),
  ('Pirimetamina',                'Pirimetamina',                 'Oral',   '25 mg',            'Comprimido',            17),
  ('Primaquina',                  'Primaquina',                   'Oral',   '15 mg',            'Comprimido',            17),
  ('Secnidazol',                  'Secnidazol',                   'Oral',   '1000 mg',          'Comprimido',            17);

-- ── R – Aparelho Respiratório (18) ───────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Beclometasona, dipropionato',                                  'Beclometasona',                    'Inalatória', '200 mcg/dose',          'Solução para inalação oral',        18),
  ('Beclometasona, dipropionato',                                  'Beclometasona',                    'Inalatória', '50 mcg/dose',           'Solução para inalação oral',        18),
  ('Formoterol',                                                   'Formoterol',                       'Inalatória', '12 mcg',                'Cápsula inalatória',                18),
  ('Formoterol + Budesonida',                                      'Formoterol + Budesonida',          'Inalatória', '6 mcg + 200 mcg',       'Cápsula inalatória',                18),
  ('Formoterol + Budesonida',                                      'Formoterol + Budesonida',          'Inalatória', '12 mcg + 400 mcg',      'Cápsula inalatória',                18),
  ('Loratadina',                                                   'Loratadina',                       'Oral',       '10 mg',                 'Comprimido',                        18),
  ('Loratadina',                                                   'Loratadina',                       'Oral',       '1 mg/mL',               'Xarope',                            18),
  ('Mepolizumabe',                                                 'Mepolizumabe',                     'Parenteral', '100 mg/ml',             'Solução injetável',                 18),
  ('Omalizumabe',                                                  'Omalizumabe',                      'Parenteral', '150 mg',                'Solução injetável',                 18),
  ('Prometazina, cloridrato',                                      'Prometazina',                      'Oral',       '25 mg',                 'Comprimido',                        18),
  ('Salbutamol, sulfato',                                          'Salbutamol',                       'Inalatória', '100 mcg/dose',          'Suspensão para aerossol oral',      18),
  ('Tiotrópio, brometo + Olodaterol, cloridrato',                  'Tiotrópio + Olodaterol',           'Inalatória', '2,5 mcg + 2,5 mcg',    'Solução para inalação oral',        18),
  ('Umeclidínio, brometo + Vilanterol, trifenatato',               'Umeclidínio + Vilanterol',         'Inalatória', '62,5 mcg + 25 mcg',    'Pó para inalação',                  18);

-- ── S – Órgãos Sensitivos (19) ───────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Bimatoprosta',              'Bimatoprosta',             'Oftálmica', '0,3 mg/ml (0,03%)',   'Solução oftálmica (frasco com 3 ml)',   19),
  ('Brinzolamida',              'Brinzolamida',             'Oftálmica', '10 mg/ml',            'Suspensão oftálmica (frasco com 5 ml)', 19),
  ('Brimonidina, dextrotartarato','Brimonidina',            'Oftálmica', '2 mg/ml',             'Solução oftálmica (frasco com 5 ml)',   19),
  ('Dorzolamida, cloridrato',   'Dorzolamida',              'Oftálmica', '20 mg/ml (2%)',       'Solução oftálmica (frasco com 5 ml)',   19),
  ('Latanoprosta',              'Latanoprosta',             'Oftálmica', '0,05 mg/ml (0,005%)','Solução oftálmica (frasco com 2,5 ml)', 19),
  ('Timolol, maleato',          'Timolol',                  'Oftálmica', '5 mg/ml (0,5%)',      'Solução oftálmica',                    19),
  ('Travoprosta',               'Travoprosta',              'Oftálmica', '0,04 mg/ml',          'Solução oftálmica (frasco com 2,5 ml)', 19);

-- ── V – Vários e Insumos (20) ────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Ácido folínico (Folinato de cálcio)',                    'Ácido folínico',    'Oral',   '15 mg',              'Comprimido',   20),
  ('Ácido tricloroacético (ATA)',                            'ATA',               'Tópica', '80–90% em solução alcoólica', 'Frasco', 20),
  ('Agulha para caneta aplicadora de insulina',              NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Atadura',                                                NULL,                'N/A',    '15 x 4,5 cm',        'Unidade',      20),
  ('Esparadrapo impermeável',                                NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Esparadrapo micropore',                                  NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Gaze não estéril',                                       NULL,                'N/A',    '7,5 x 7,5 cm',       'Unidade',      20),
  ('Hipoclorito de sódio',                                   'Hipoclorito de sódio', 'N/A', '25 mg/mL (2,5%)',    'Solução',      20),
  ('Lancetas para punção digital',                           NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Luva para procedimento',                                 NULL,                'N/A',    'Tamanho P/M/G',      'Unidade',      20),
  ('Preservativo feminino',                                  NULL,                'N/A',    'Até 20 cm',          'Unidade',      20),
  ('Preservativo masculino',                                 NULL,                'N/A',    '160 x 52 mm',        'Unidade',      20),
  ('Preservativo masculino',                                 NULL,                'N/A',    '160 x 49 mm',        'Unidade',      20),
  ('Saco coletor',                                           NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Seringa com agulha acoplada para aplicação de insulina', NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Seringa descartável 10 ml',                              NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Sevelamer, cloridrato',                                  'Sevelamer',         'Oral',   '800 mg',             'Comprimido',   20),
  ('Sonda uretral Nº 6',                                     NULL,                'N/A',    'Nº 6',               'Unidade',      20),
  ('Sonda uretral Nº 8',                                     NULL,                'N/A',    'Nº 8',               'Unidade',      20),
  ('Sonda uretral Nº 10',                                    NULL,                'N/A',    'Nº 10',              'Unidade',      20),
  ('Sonda uretral Nº 12',                                    NULL,                'N/A',    'Nº 12',              'Unidade',      20),
  ('Sonda uretral Nº 14',                                    NULL,                'N/A',    'Nº 14',              'Unidade',      20),
  ('Tiras reagentes para medida de glicemia capilar',        NULL,                'N/A',    NULL,                 'Unidade',      20),
  ('Tuberculina (PPD)',                                       'Tuberculina PPD',   'Parenteral', NULL,            'Solução injetável', 20),
  ('Óleo mineral puro',                                      'Óleo mineral',      'Tópica',     NULL,             'Óleo',              20),
  ('Atadura de crepom',                                      NULL,                'N/A',        NULL,             'Unidade',           20);

-- ── H* – Fitoterápicos (21) ──────────────────────────────────
INSERT INTO medicamentos (nome, principio_ativo, via_administracao, concentracao, apresentacao, id_categoria) VALUES
  ('Guaco (Mikania glomerata Spreng.)',         'Mikania glomerata',       'Oral',   '10% (10 g de folhas/100 mL)',  'Xarope',         21),
  ('Chambá (Justicia pectoralis)',              'Justicia pectoralis',     'Oral',   '5% (5 g de folhas/100 mL)',    'Xarope',         21),
  ('Alecrim-pimenta (Lippia sidoides Cham.)',   'Lippia sidoides',         'Tópica', '4% (sabonete líquido)',        'Sabonete líquido',21),
  ('Alecrim-pimenta (Lippia sidoides Cham.)',   'Lippia sidoides',         'Tópica', '20% (30 mL de tintura)',       'Tintura',        21),
  ('Alecrim-pimenta (Lippia sidoides Cham.)',   'Lippia sidoides',         'Tópica', '2% (gel)',                    'Gel',            21),
  ('Babosa (Aloe vera)',                        'Aloe vera',               'Tópica', '5%',                          'Gel e Pomada',   21),
  ('Cidreira (Lippia alba)',                    'Lippia alba',             'Oral',   '8% (elixir)',                 'Elixir',         21),
  ('Confrei (Symphytum officinale)',            'Symphytum officinale',    'Tópica', '5%',                          'Pomada',         21),
  ('Confrei (Symphytum officinale)',            'Symphytum officinale',    'Tópica', '5%',                          'Gel e Pomada',   21);

-- ============================================================
-- VERIFICAÇÃO
-- SELECT COUNT(*) FROM categorias;   -- 21
-- SELECT COUNT(*) FROM medicamentos; -- ~454
-- SELECT c.nome, COUNT(m.id_medicamento) AS total
--   FROM categorias c
--   LEFT JOIN medicamentos m ON m.id_categoria = c.id_categoria
--   GROUP BY c.nome ORDER BY c.nome;
-- ============================================================
