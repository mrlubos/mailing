require_relative '../helpers/test_runner_utils'

class RedwoodTsApp < App
  include TestRunnerUtils

  def initialize(root_dir, *args)
    super('redwood_ts', root_dir, *args)
  end

private
  def yarn_create!
    Dir.chdir(@root_dir) do
      system_quiet("yarn create redwood-app . --typescript")
    end
  end
end