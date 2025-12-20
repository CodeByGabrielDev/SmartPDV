package br.com.TrueUnion.TrueUnion.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;

@Repository
public interface StatusProposalRepository extends CrudRepository<StatusProposal, Integer> {

}
