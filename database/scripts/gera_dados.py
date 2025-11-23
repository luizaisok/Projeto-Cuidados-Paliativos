# Não precise re-executar esse script, pq os CSVs já foram geradaos
# Mas caso necessite gerá-los novamente, execute: cd database/scripts/ >> python gera_dados.py 
# Você deve estar em root/database/scripts/ para executar o script Python se não gerará os CVSs em outro lugar fora de roo/database/data/ !!!

import csv
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker('pt_BR')

# Criar pasta data se não existir
import os

# Caminho correto: scripts -> database -> data
data_path = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(data_path, exist_ok=True)

# Função para gerar data aleatória
def random_date(start_year=1940, end_year=2005):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + timedelta(days=random.randint(0, (end - start).days))

# Gerar 100 pacientes
print("Gerando pacientes...")
with open(os.path.join(data_path, 'pacientes.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['email', 'senha', 'nome', 'nome_social', 'celular', 'genero', 
                     'data_nascimento', 'cidade', 'estado', 'tipo_sanguineo', 
                     'condicoes_medicas', 'medicacao', 'contato_emergencia', 'unidades_de_saude'])
    
    tipos_sanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    generos = ['Masculino', 'Feminino', 'Não-binário']
    estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'PA']
    condicoes = ['Câncer', 'Doença cardíaca', 'Diabetes', 'Hipertensão', 'DPOC', 'Alzheimer']
    medicacoes = ['Morfina', 'Paracetamol', 'Ibuprofeno', 'Metformina', 'Losartana', 'Omeprazol']
    
    for i in range(1, 101):
        nome = fake.name()
        email = f"paciente{i}@email.com"
        senha = fake.password()
        nome_social = nome if random.random() > 0.1 else fake.first_name()
        celular = fake.phone_number()
        genero = random.choice(generos)
        data_nasc = random_date(1940, 2005).strftime('%Y-%m-%d')
        cidade = fake.city()
        estado = random.choice(estados)
        tipo_sang = random.choice(tipos_sanguineos)
        condicao = ', '.join(random.sample(condicoes, random.randint(1, 3)))
        medicacao = ', '.join(random.sample(medicacoes, random.randint(1, 4)))
        contato_emerg = fake.phone_number()
        unidade = f"UBS {fake.street_name()}"
        
        writer.writerow([email, senha, nome, nome_social, celular, genero, data_nasc, 
                        cidade, estado, tipo_sang, condicao, medicacao, contato_emerg, unidade])

# Gerar 50 acompanhantes
print("Gerando acompanhantes...")
with open(os.path.join(data_path, 'acompanhantes.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['email', 'senha', 'nome_completo', 'nome_social', 'telefone', 
                     'genero', 'data_nascimento'])
    
    for i in range(1, 51):
        nome = fake.name()
        email = f"acompanhante{i}@email.com"
        senha = fake.password()
        nome_social = nome if random.random() > 0.1 else fake.first_name()
        telefone = fake.phone_number()
        genero = random.choice(generos)
        data_nasc = random_date(1960, 2000).strftime('%Y-%m-%d')
        
        writer.writerow([email, senha, nome, nome_social, telefone, genero, data_nasc])

# Gerar vínculos acompanhante-paciente
print("Gerando vínculos...")
with open(os.path.join(data_path, 'acompanhante_paciente.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['acompanhante_id', 'paciente_id'])
    
    vinculos = set()
    
    # Cada acompanhante tem de 1 a 3 pacientes
    for acomp_id in range(1, 51):
        num_pacientes = random.randint(1, 3)
        pacientes_vinculados = random.sample(range(1, 101), num_pacientes)
        
        for pac_id in pacientes_vinculados:
            if (acomp_id, pac_id) not in vinculos:
                vinculos.add((acomp_id, pac_id))
                writer.writerow([acomp_id, pac_id])

# Gerar conteúdos
print("Gerando conteúdos...")
with open(os.path.join(data_path, 'conteudo.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['titulo', 'descricao', 'texto', 'data_post', 'sinaisSintomas', 'sinaisAlerta'])
    
    conteudos = [
        ('Dor Crônica em Cuidados Paliativos', 'Reconhecendo a dor persistente', 
         'A dor é um dos sintomas mais comuns e deve ser avaliada de forma contínua.', 
         '2025-10-01', 'Dor contínua, limitação de movimento', 'Dor súbita intensa, perda de consciência'),
        
        ('Fadiga Intensa no Paciente Terminal', 'Identificando sinais de esgotamento', 
         'A fadiga pode afetar a qualidade de vida e requer manejo multidisciplinar.', 
         '2025-09-18', 'Cansaço extremo, fraqueza', 'Incapacidade de realizar atividades básicas'),
        
        ('Falta de Apetite e Perda de Peso', 'Anorexia e caquexia em estágios avançados', 
         'Esses sintomas são frequentes e demandam suporte nutricional adequado.', 
         '2025-09-05', 'Apetite reduzido, emagrecimento', 'Perda de peso acelerada, desidratação'),
        
        ('Dispneia e Dificuldade para Respirar', 'Sinais de desconforto respiratório', 
         'A sensação de falta de ar é comum e pode ser aliviada com oxigênio e posicionamento adequado.', 
         '2025-08-20', 'Falta de ar leve, respiração acelerada', 'Cianose, respiração muito dificultada'),
        
        ('Ansiedade e Angústia Emocional', 'Aspectos psicológicos do paciente', 
         'O apoio emocional e espiritual é essencial no manejo paliativo.', 
         '2025-08-01', 'Preocupação constante, inquietação', 'Crises de pânico, agitação grave'),
        
        ('Náuseas e Vômitos em Cuidados Paliativos', 'Identificando causas e controle', 
         'Podem estar relacionados a medicamentos ou à progressão da doença.', 
         '2025-07-15', 'Enjoo, mal-estar', 'Vômitos persistentes, sinais de desidratação'),
        
        ('Confusão Mental e Delirium', 'Alterações cognitivas frequentes', 
         'É importante identificar causas reversíveis e oferecer ambiente calmo e seguro.', 
         '2025-07-02', 'Desorientação leve, lapsos de memória', 'Alucinações, agitação intensa'),
        
        ('Insônia e Distúrbios do Sono', 'Impactos na qualidade de vida', 
         'A falta de sono pode agravar sintomas físicos e emocionais.', 
         '2025-06-25', 'Dificuldade para dormir, despertares frequentes', 'Vigília prolongada, exaustão intensa'),
        
        ('Feridas e Lesões de Pele', 'Cuidados com integridade cutânea', 
         'As lesões exigem manejo adequado para evitar dor e infecção.', 
         '2025-06-10', 'Vermelhidão, dor localizada', 'Infecção, mau odor, secreção'),
        
        ('Comunicação com a Família', 'Reconhecendo sinais de sofrimento familiar', 
         'A equipe deve apoiar e orientar familiares sobre o processo de fim de vida.', 
         '2025-05-30', 'Tristeza, preocupação', 'Conflitos graves, desesperação')
    ]
    
    for conteudo in conteudos:
        writer.writerow(conteudo)

# Gerar sintomas
print("Gerando sintomas...")
with open(os.path.join(data_path, 'sintomas.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['nome_sintoma'])
    
    sintomas = [
        'Dor de cabeça',
        'Náusea',
        'Tontura',
        'Cansaço',
        'Falta de apetite',
        'Insônia',
        'Falta de ar',
        'Febre'
    ]
    
    for sintoma in sintomas:
        writer.writerow([sintoma])

# Gerar registros de sintomas
print("Gerando registros...")
with open(os.path.join(data_path, 'registro.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['paciente_id', 'sintoma_id', 'intensidade', 'data_registro'])
    
    # Gerar 100 registros aleatórios
    for i in range(100):
        paciente_id = random.randint(1, 100)  # IDs dos pacientes
        sintoma_id = random.randint(1, 8)     # IDs dos sintomas (8 sintomas)
        intensidade = random.randint(1, 10)   # Escala de 1 a 10
        # Data aleatória nos últimos 30 dias
        dias_atras = random.randint(0, 30)
        data_registro = (datetime.now() - timedelta(days=dias_atras)).strftime('%Y-%m-%d %H:%M:%S')
        
        writer.writerow([paciente_id, sintoma_id, intensidade, data_registro])

print(f"\nCSVs gerados com sucesso em: {data_path}")
print("- pacientes.csv (100 registros)")
print("- acompanhantes.csv (50 registros)")
print("- acompanhante_paciente.csv (vínculos)")
print("- conteudo.csv (10 registros)")
print("- sintomas.csv (8 registros)")
print("- registro.csv (100 registros)")