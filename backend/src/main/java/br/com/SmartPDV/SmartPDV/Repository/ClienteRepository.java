package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Clientes;

@Repository
public interface ClienteRepository extends CrudRepository<Clientes, Long> {
    @Query("SELECT E FROM Clientes E WHERE E.cpfCnpj = :documento")
    Clientes selectByCpfOrCnpj(@Param("documento") String documento);
    @Query("SELECT E FROM Clientes E WHERE E.email = :email")
    Clientes selectByEmail(@Param("email")String email);
}
