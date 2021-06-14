import React, { useState, useEffect, FormEvent } from "react"
import { Link } from "react-router-dom"

import api from "../../services/apiClient"

// Visual

import { FiChevronRight } from "react-icons/fi"
import logoImg from "../../assets/logo.svg"
import { Title, Form, Repositories, Error } from "./styles"

interface Repository {
	full_name: string
	description: string
	owner: {
		login: string
		avatar_url: string
	}
}

const Dashboard: React.FC = () => {
	const [newRepo, setNewRepo] = useState("")
	const [inputError, setInputError] = useState("")
	const [repositories, setRepositories] = useState<Repository[]>(() => {
		const storagedRepositories = localStorage.getItem(
			"@GithubExplorer:repositories"
		)

		// prettier-ignore
		if (storagedRepositories)
		   return JSON.parse(storagedRepositories)

		return []
	})

	useEffect(() => {
		localStorage.setItem(
			"@GithubExplorer:repositories",
			JSON.stringify(repositories)
		)
	}, [repositories])

	const handleAddRepository = async (
		event: FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault()

		if (!newRepo) {
			setInputError("Digite o autor/nome do repositório")
			return
		}

		try {
			const response = await api.get<Repository>(`repos/${newRepo}`)

			const repository = response.data

			setRepositories([...repositories, repository])

			setNewRepo("")
			setInputError("")
		} catch (err) {
			setInputError("Erro na busca por esse reporitório")
		}
	}

	return (
		<>
			<img src={logoImg} alt="Github Explorer" />
			<Title>Explore repositórios no GitHub</Title>

			<Form hasError={!!inputError} onSubmit={handleAddRepository}>
				<input
					value={newRepo}
					onChange={e => setNewRepo(e.target.value)}
					placeholder="Digite o nome do repositório"
				/>
				<button type="submit">Pesquisar</button>
			</Form>

			{inputError && <Error>{inputError}</Error>}

			<Repositories>
				{repositories.map(rep => (
					<Link key={rep.full_name} to={`repository/${rep.full_name}`}>
						<img src={rep.owner.avatar_url} alt={rep.owner.login} />
						<div>
							<strong>{rep.full_name}</strong>
							<p>{rep.description}</p>
						</div>

						<FiChevronRight size={20} />
					</Link>
				))}
			</Repositories>
		</>
	)
}
export default Dashboard
