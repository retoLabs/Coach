match (ini) where not (ini)-[:ARCO]-() return ID(ini) as id0, ini,null as arc, 0 as id1, null as fin union match (ini)-[arc]->(fin) return ID(ini) as id0,ini,arc,ID(fin) as id1,fin;