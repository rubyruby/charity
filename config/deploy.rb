set :application, 'charity.rubyruby.ru'
set :repo_url,  'git@github.com:rubyruby/charity.git'
set :deploy_to, "/srv/#{fetch(:application)}"
set :keep_releases, 5

set :yarn_flags, '--silent --no-progress'
set :yarn_roles, :all
set :yarn_env_variables, {}

namespace :yarn do
  task :build do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute "cd #{release_path} && yarn build"
      end
    end
  end
end

after 'yarn:install', 'yarn:build'

after 'deploy:finishing', 'deploy:cleanup'